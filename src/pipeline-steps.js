import {Connection, Device, Notification} from "apn";
import BPromise from "bluebird";
import {prop} from "ramda";

import {findOne} from "./common/mongodb";
import * as config from "./common/config";

export function getUserApnToken (userId) {
    return findOne({
        url: config.MONGODB_URL,
        collectionName: "users",
        query: {
            _id: userId
        }
    }).then(prop("appRegistrationId"));
}

export function apnPush (message, apnToken) {
    return new BPromise(function (resolve, reject) {
        const cert = new Buffer(config.APN_CERTIFICATE, "base64");
        const key = new Buffer(config.APN_KEY, "base64");
        const device = new Device(apnToken);
        const notification = new Notification();
        notification.badge = 1;
        notification.sound = "default";
        notification.alert = message;
        new Connection({cert, key})
            .on("error", reject)
            .on("transmitted", resolve)
            .pushNotification(notification, device);
    });
}
