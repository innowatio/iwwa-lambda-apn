import {Connection, Device, Notification} from "apn";
import {delay} from "bluebird";

import {
    APN_CERTIFICATE,
    APN_KEY,
    APN_PRODUCTION,
    TRANSMISSION_WAIT_TIME
} from "../config";
import log from "./logger";

const connection = new Connection({
    cert: new Buffer(APN_CERTIFICATE, "base64"),
    key: new Buffer(APN_KEY, "base64"),
    production: APN_PRODUCTION
});
connection.on("transmissionError", (errorCode, notification, device) => {
    log.error(
        `Error transmitting notification to device with token ${device}`,
        {errorCode}
    );
});

export function push (message, apnToken) {
    log.info(`Sending notification to device with token ${apnToken}`);
    const device = new Device(apnToken);
    const notification = new Notification();
    notification.badge = 1;
    notification.sound = "default";
    notification.alert = message;
    connection.pushNotification(notification, device);
    /*
    *   The apn module gives no way of figuring out when a notification is
    *   successfully delievered, due to issues with the apn connection protocol.
    *   Therefore the only thing we can do is waiting a certain (configurable)
    *   amount of time before declaring the notification as successfully
    *   delievered. Note that we don't have any guarantee that the notification
    *   has actually been successfully delievered. We just assume so and hope
    *   for the best.
    */
    return delay(TRANSMISSION_WAIT_TIME);
}
