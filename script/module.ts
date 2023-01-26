import path from "path";
import { ModuleGenerator } from "@Iamyth/devtool-utils";

new ModuleGenerator({
    moduleDirectory: path.join(__dirname, "../src/web/src/module"),
}).run();
