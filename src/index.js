import "babel/polyfill";
import {map} from "bluebird";
import router from "kinesis-router";
import get from "lodash.get";

import mongodb from "./services/mongodb";
import {push} from "./services/apn";
import log from "./services/logger";

async function pushPipeline (event) {
    const {data: {message, userId}} = event;
    log.debug(`Received push notification request`, {message, userId});
    // Retrieve the user
    const db = await mongodb;
    const user = await db.collection("users").findOne({_id: userId});
    log.debug(`Retrieved user ${userId}`, {user});
    // Get list of the user's apn tokens. The can be more than one because the
    // user can have multiple devices and each device has its own token.
    const devices = get(user, "services.apn.devices", []);
    const tokens = devices.map(device => device.token);
    log.debug(`Retrieved ${tokens.length} tokens for user ${userId}`, {tokens});
    // Push to all devices
    await map(tokens, token => push(message, token));
    log.debug(`Pushed notification to all devices of user ${userId}`);
}

export const handler = router()
    .on("push to ios device", pushPipeline);
