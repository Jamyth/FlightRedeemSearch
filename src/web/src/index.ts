import { createApp, async } from "react-shiba";
import { ErrorHandler } from "util/ErrorHandler";

const MainComponent = async(() => import("module/main"), "MainComponent");

createApp({
    Component: MainComponent,
    entryElement: document.getElementById("app"),
    errorHandler: new ErrorHandler(),
});
