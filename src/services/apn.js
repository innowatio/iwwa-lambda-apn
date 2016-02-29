import {Connection, Device, Notification} from "apn";
import {delay} from "bluebird";

import * as config from "../config";

const cert = new Buffer(config.APN_CERTIFICATE, "base64");
const key = new Buffer(config.APN_KEY, "base64");
const connection = new Connection({cert, key});

export function push (message, apnToken) {
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
    return delay(config.TRANSMISSION_WAIT_TIME);
}