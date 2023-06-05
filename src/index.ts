#!/usr/bin/env node

import rootCheck = require("root-check");
import semver = require("semver");
import fs = require("fs");
import logger = require("./utils/logger");
import DevCommand = require("./commands/dev");
import InitCommand = require("./commands/init");
import PublishCommand = require("./commands/publish");

import { CLI_NAME, USER_HOME_PATH } from './constant';
import { program } from "commander";
const pkg = require("../package.json");

const prepare = async () => {
    checkNodeVersion(pkg.engines.node);
    checkIsRoot();
    checkUSER_HOME_PATH()
}

const checkNodeVersion = (requireNodeVersion: string) => {
    const currentVersion = process.version;
    if (!semver.satisfies(currentVersion, requireNodeVersion)) {
        const errMsg =
            "The current Node version is " + currentVersion +
            ", and " + CLI_NAME + " requires Node version " + requireNodeVersion +
            " or above to be used. " +
            "Please update the Node version."
        throw new Error(errMsg)
    }
}

const checkIsRoot = () => rootCheck();

const checkUSER_HOME_PATH = () => {
    if (!USER_HOME_PATH || !fs.existsSync(USER_HOME_PATH)) {
        throw new Error("The current user's home directory does not exist.")
    }
};

const registerCommand = () => {
   
    program
    .version(pkg.version)
    .name(CLI_NAME)
    .usage('<command> [options]');

    program
    .option('-d, --debug', 'enabling debug mode', false)
    .option('-dp, --dirPath <dirPath>', 'specify the local test directory for development');

    program
    .command('init [command]')
    .description('initialize the project')
    .option('-f, --force', 'force initialize the project', false)
    .option('-du, --disableupdate', 'disable automatic download of the latest version package', false)
    .action((...arg) => {
        InitCommand(arg[0], arg[1], arg[2]);
    });
    program.parse(process.argv);
}

(
    async () => {
        try {
            await prepare();
            registerCommand()
        } catch (e) {
            logger.error("", (e as Error).stack);
            process.exit(1);
        }

    }
)()