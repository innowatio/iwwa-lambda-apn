import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {find, range} from "ramda";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import pipelineSteps, {apnPush} from "pipeline-steps";

const mockConfig = {
    APN_CERTIFICATE: new Buffer("APN_CERTIFICATE").toString("base64"),
    APN_KEY: new Buffer("APN_KEY").toString("base64"),
    MONGODB_URL: "MONGODB_URL"
};

describe("`apnPush`", function () {

    const Notification = sinon.spy();
    const Device = sinon.spy(function (token) {
        this.token = token;
    });
    const connection = {
        on: sinon.spy(() => connection),
        pushNotification: sinon.spy()
    };
    const Connection = sinon.spy(() => connection);

    beforeEach(function () {
        Connection.reset();
        connection.on.reset();
        connection.pushNotification.reset();
        pipelineSteps.__Rewire__("config", mockConfig);
        pipelineSteps.__Rewire__("Connection", Connection);
        pipelineSteps.__Rewire__("Device", Device);
        pipelineSteps.__Rewire__("Notification", Notification);
    });

    afterEach(function () {
        pipelineSteps.__ResetDependency__("config");
        pipelineSteps.__ResetDependency__("Connection");
        pipelineSteps.__ResetDependency__("Device");
        pipelineSteps.__ResetDependency__("Notification");
    });

    it("returns a promise", function () {
        expect(apnPush("message", "token").then).to.be.a("function");
    });

    it("instantiates a `Connection` with the correct parameters", function () {
        apnPush("message", "token");
        expect(Connection).to.have.been.calledWith({
            cert: new Buffer("APN_CERTIFICATE"),
            key: new Buffer("APN_KEY")
        });
    });

    it("calls the `pushNotification` method of the `Connection` instance", function () {
        apnPush("message", "token");
        const notification = {
            alert: "message",
            badge: 1,
            sound: "default"
        };
        const device = {
            token: "token"
        };
        expect(connection.pushNotification).to.have.been.calledWith(notification, device);
    });



});

describe("the promise returned by `apnPush`", function () {

    const Notification = sinon.spy();
    const Device = sinon.spy(function (token) {
        this.token = token;
    });
    const connection = {
        on: sinon.spy(() => connection),
        pushNotification: sinon.spy()
    };
    const Connection = sinon.spy(() => connection);

    beforeEach(function () {
        Connection.reset();
        connection.on.reset();
        connection.pushNotification.reset();
        pipelineSteps.__Rewire__("config", mockConfig);
        pipelineSteps.__Rewire__("Connection", Connection);
        pipelineSteps.__Rewire__("Device", Device);
        pipelineSteps.__Rewire__("Notification", Notification);
    });

    afterEach(function () {
        pipelineSteps.__ResetDependency__("config");
        pipelineSteps.__ResetDependency__("Connection");
        pipelineSteps.__ResetDependency__("Device");
        pipelineSteps.__ResetDependency__("Notification");
    });

    it("gets resolved when the apn notification has been transmitted", function () {
        const promise = apnPush("message", "token");
        const calls = range(0, connection.on.callCount).map(n => connection.on.getCall(n));
        const transmittedCall = find(call => call.args[0] === "transmitted", calls);
        const resolve = transmittedCall.args[1];
        resolve();
        return expect(promise).to.be.fulfilled;
    });

    it("gets rejected when the apn connection errors", function () {
        const promise = apnPush("message", "token");
        const calls = range(0, connection.on.callCount).map(n => connection.on.getCall(n));
        const errorCall = find(call => call.args[0] === "error", calls);
        const reject = errorCall.args[1];
        reject();
        return expect(promise).to.be.rejected;
    });

});
