import fs from "fs";
import path from "path";

function generate<T>(filename: string, content: string[]) {
    const _content = content.join("\n");

    const downloadDirectory = path.join(process.cwd(), "./csv");

    const filePath = path.join(downloadDirectory, filename);

    if (!fs.existsSync(downloadDirectory) || !fs.statSync(downloadDirectory).isDirectory()) {
        fs.mkdirSync(downloadDirectory);
    }

    fs.writeFileSync(filePath, _content, { encoding: "utf-8" });
    console.info("File is saved to", filePath);
}

export const CSVUtil = Object.freeze({
    generate,
});
