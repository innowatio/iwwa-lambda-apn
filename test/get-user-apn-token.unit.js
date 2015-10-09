import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import pipelineSteps, {getUserApnToken} from "pipeline-steps";

const mockConfig = {
    APN_CERTIFICATE: new Buffer("APN_CERTIFICATE").toString("base64"),
    APN_KEY: new Buffer("APN_KEY").toString("base64"),
    MONGODB_URL: "MONGODB_URL"
};

describe("`getUserApnToken`", function () {

    const findOne = sinon.stub().returns(BPromise.resolve({
        appRegistrationId: "appRegistrationId"
    }));

    beforeEach(function () {
        findOne.reset();
        pipelineSteps.__Rewire__("config", mockConfig);
        pipelineSteps.__Rewire__("findOne", findOne);
    });

    afterEach(function () {
        pipelineSteps.__ResetDependency__("config");
        pipelineSteps.__ResetDependency__("findOne");
    });

    it("returns a promise", function () {
        expect(getUserApnToken("userId").then).to.be.a("function");
    });

    it("calls `findOne` with the correct parameters", function () {
        getUserApnToken("userId");
        expect(findOne).to.have.been.calledWith({
            url: "MONGODB_URL",
            collectionName: "users",
            query: {
                _id: "userId"
            }
        });
    });

});

describe("The promise returned by `getUserApnToken`", function () {

    const findOne = sinon.stub().returns(BPromise.resolve({
        appRegistrationId: "appRegistrationId"
    }));

    beforeEach(function () {
        findOne.reset();
        pipelineSteps.__Rewire__("config", mockConfig);
        pipelineSteps.__Rewire__("findOne", findOne);
    });

    afterEach(function () {
        pipelineSteps.__ResetDependency__("config");
        pipelineSteps.__ResetDependency__("findOne");
    });

    it("resolves to the user `appRegistrationId`", function () {
        return expect(getUserApnToken("userId")).to.become("appRegistrationId");
    });

});
