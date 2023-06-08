module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module"
    },
    rules: {
        "quotes":["error","double"]
    },
    plugins: ["@typescript-eslint/eslint-plugin"]
}