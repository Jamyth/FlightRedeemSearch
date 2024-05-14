import { setUncaughtExceptionCaptureCallback } from "node:process";

setUncaughtExceptionCaptureCallback((error) => {
    console.error(error);
    process.exit(1);
});
