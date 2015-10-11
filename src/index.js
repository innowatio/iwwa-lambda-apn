import BPromise from "bluebird";
import router from "kinesis-router";
import {partial} from "ramda";

import {apnPush, getUserApnToken} from "./pipeline-steps";

function pushPipeline ({data: {message, userId}}) {
    return BPromise.resolve()
        .then(partial(getUserApnToken, userId))
        .then(partial(apnPush, message));
}

export var handler = router()
    .on("push to ios device", pushPipeline);
