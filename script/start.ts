import { ViteRunner } from "vite-runner";
import path from "path";

new ViteRunner({
    port: 8080,
    https: true,
    projectDirectory: path.join(__dirname, "../src/web"),
    tsconfigPath: path.join(__dirname, "../config/tsconfig.src.json"),
    useReact: true,
    pathResolver: [
        {
            pattern: "@core",
            resolver: () => path.join(__dirname, "../src/core"),
        },
    ],
}).startServer();
