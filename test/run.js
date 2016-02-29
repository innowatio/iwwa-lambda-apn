import Promise from "bluebird";

function objectToBase64 (object) {
    return new Buffer(
        JSON.stringify(object)
    ).toString("base64");
}

function getRecordFromObject (object) {
    return {
        kinesis: {
            data: objectToBase64(object)
        }
    };
}

function getKinesisEventFromArray (array) {
    return {
        "Records": array.map(getRecordFromObject)
    };
}

export default function run (handler, events) {
    events = Array.isArray(events) ? events : [events];
    return new Promise((resolve, reject) => {
        handler(getKinesisEventFromArray(events), {
            succeed: resolve,
            fail: reject
        });
    });
}
