import {handler} from "index";

import run from "./run";

async function test () {
    await run(handler, {
        type: "push to ios device",
        data: {
            message: "Test message",
            userId: process.env.TEST_USER_ID
        }
    });
    process.exit();
}

test();
