import { ViteRunner } from "vite-runner";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import url from "url";
import path from "path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

new ViteRunner({
    port: 8080,
    https: true,
    rootDirectory: path.join(__dirname, "../src/web-svelte"),
    tsconfigPath: path.join(__dirname, "../config/tsconfig.web.json"),
    useReact: false,
    pathResolver: [
        {
            pattern: "@core",
            resolver: () => path.join(__dirname, "../src/core"),
        },
    ],
    plugins: [svelte()],
}).startServer();
