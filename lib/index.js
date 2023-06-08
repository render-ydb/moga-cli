#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rootCheck = require("root-check");
const semver = require("semver");
const fs = require("fs");
const devCommand = require("./commands/dev");
const initCommand = require("./commands/init");
const publishCommand = require("./commands/publish");
const render_utils_1 = require("render-utils");
const constant_1 = require("./constant");
const commander_1 = require("commander");
const pkg = require("../package.json");
const prepare = () => __awaiter(void 0, void 0, void 0, function* () {
    checkNodeVersion(pkg.engines.node);
    checkIsRoot();
    checkUSER_HOME_PATH();
});
const checkNodeVersion = (requireNodeVersion) => {
    const currentVersion = process.version;
    if (!semver.satisfies(currentVersion, requireNodeVersion)) {
        const errMsg = "The current Node version is " + currentVersion +
            ", and " + constant_1.CLI_NAME + " requires Node version " + requireNodeVersion +
            " or above to be used. " +
            "Please update the Node version.";
        throw new Error(errMsg);
    }
};
const checkIsRoot = () => rootCheck();
const checkUSER_HOME_PATH = () => {
    if (!constant_1.USER_HOME_PATH || !fs.existsSync(constant_1.USER_HOME_PATH)) {
        throw new Error("The current user's home directory does not exist.");
    }
};
const registerCommand = () => {
    commander_1.program
        .version(pkg.version)
        .name(constant_1.CLI_NAME)
        .usage('<command> [options]');
    commander_1.program
        .option('-d, --debug', 'enable debug mode', false)
        .option('-tp, --testPath <testPath>', 'specify the local test directory for development');
    // initialize the moka component or app
    commander_1.program
        .command('init [command]')
        .description('initialize the project')
        .option('-f, --force', 'force initialize the project', false)
        .option('-du, --disableupdate', 'disable automatic download of the latest version package', false)
        .action((...arg) => {
        initCommand(arg[0], arg[1], arg[2]);
    });
    // run the moka component or app
    commander_1.program
        .command('dev [command]')
        .description('run the moka component or app')
        .action((...arg) => {
        devCommand(arg[0], arg[1], arg[2]);
    });
    // publish the moka component or app    
    commander_1.program
        .command('publish [command]')
        .description('publish the moka component or app    ')
        .action((...arg) => {
        publishCommand(arg[0], arg[1], arg[2]);
    });
    // command tips 
    commander_1.program.on('command:*', (unavailableCommands) => {
        const unknownCommandName = unavailableCommands[0];
        render_utils_1.log.error(`unknown command '${unknownCommandName}'`);
        let maxIndex = 0;
        let result = 0;
        commander_1.program.commands.forEach((cmd, index) => {
            const res = (0, render_utils_1.similar)(cmd.name(), unknownCommandName);
            if (res > result) {
                result = res;
                maxIndex = index;
            }
        });
        if (result) {
            console.log(`Do you mean is "${commander_1.program.commands[maxIndex].name()}" command`);
        }
    });
    // enable debug mode
    commander_1.program.on('option:debug', () => {
        render_utils_1.log.setLogLevel("debug");
    });
    commander_1.program.on('option:testPath', () => {
        process.env.LOCAL_DEV_PATH = commander_1.program.opts().testPath;
    });
    commander_1.program.parse(process.argv);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prepare();
        registerCommand();
    }
    catch (e) {
        render_utils_1.log.error(e.stack);
        process.exit(1);
    }
}))();
