import { ViteBuilder } from "vite-runner";
import path from "path";

new ViteBuilder({
    rootDirectory: path.join(__dirname, "../src/web"),
    outDirectory: path.join(__dirname, "../build"),
    tsconfigPath: path.join(__dirname, "../config/tsconfig.src.json"),
    pathResolver: [
        {
            pattern: "@core",
            resolver: () => path.join(__dirname, "../src/core"),
        },
    ],
}).build();
