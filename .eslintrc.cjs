/** @type {import('eslint').Linter.Config} */
const config = {
    ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/test/**"],
    extends: ["iamyth/preset/node"],
    root: true,
    rules: {
        "@typescript-eslint/member-ordering": "off",
        "iamyth/deep-nested-relative-imports": "off",
    },
};

module.exports = config;
