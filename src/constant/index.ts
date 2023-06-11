import os = require("os");

export const USER_HOME_PATH = os.homedir()
export const CLI_NAME = "moga-cli";

export const APP_LIST: Array<{ name: string, value: string }> = [
    {
        name: "component-app (applicaiton of MOGA-compliant components)",
        value: "moga-component"
    },
    {
        name: "module-app (applicaiton of MOGA-compliant module)",
        value: "moga-module"
    },
    {
        name: "web-app (applicaiton of MOGA-compliant web)",
        value: "moga-web"
    },
    {
        name: "h5-app (applicaiton of MOGA-compliant h5)",
        value: "moga-h5"
    },
    {
        name: "mpa-app (applicaiton of MOGA-compliant mpa)",
        value: "moga-mpa"
    },
];

export const BUILDER_CONFIG_FILE_TYPE = ["build.json", "build.config.(js|ts|mjs|mts|cjs|cts)"];