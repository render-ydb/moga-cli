"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI_NAME = exports.USER_HOME_PATH = void 0;
const os = require("os");
exports.USER_HOME_PATH = os.homedir();
exports.CLI_NAME = "mock-cli";
