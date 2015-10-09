import BPromise from "bluebird";
import router from "kinesis-router";
import {partial} from "ramda";

import {apnPush, getUserToken} from "./pipeline-steps";

function pushPipeline (event) {
    const {message, userId} = event.data;
    return BPromise.resolve()
        .then(partial(getUserToken, userId))
        .then(partial(apnPush, message));
}

export var handler = router()
    .on("push to ios device", pushPipeline);
