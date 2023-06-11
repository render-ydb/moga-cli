#!/usr/bin/env node

import rootCheck = require("root-check");
import semver = require("semver");
import fs = require("fs");
import initCommand = require("./commands/init");
import startCommand = require("./commands/start");
import buildCommand = require("./commands/build");
import publishCommand = require("./commands/publish");


import { similar, log } from "render-utils";
import { CLI_NAME, USER_HOME_PATH } from "./constant";
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
        .usage("<command> [options]");

    program
        .option("-d, --debug", "enable debug mode", false)
        .option("-tp, --testPath <testPath>", "specify the local test directory for development");

    // initialize the moga component or app
    program
        .command("init [command]")
        .description("initialize the project")
        .option("-f, --force", "force initialize the project", false)
        .action((...arg) => {
            initCommand(arg[0], arg[1], arg[2]);
        });

    // run the moga component or app
    program
        .argument("<file>")
        .command("dev [command]")
        .description("run the moga component or app")
        .option("--config [config]", "specify configuration file location")
        .action((...arg) => {
            startCommand(arg[0], arg[1], arg[2]);
        });

    // build moga app
    program
        .command("build [command]")
        .description("build the moga app")
        .action((...arg) => {
            buildCommand(arg[0], arg[1], arg[2]);
        });


    // publish the moga component or app    
    program
        .command("publish [command]")
        .description("publish the moga component or app")
        .action((...arg) => {
            publishCommand(arg[0], arg[1], arg[2]);
        });

    // command tips 
    program.on("command:*", (unavailableCommands) => {
        const unknownCommandName = unavailableCommands[0];
        log.error(`unknown command '${unknownCommandName}'`);

        let maxIndex = 0;
        let result = 0;
        program.commands.forEach((cmd, index) => {
            const res = similar(cmd.name(), unknownCommandName);
            if (res > result) {
                result = res;
                maxIndex = index;
            }
        });
        if (result) {
            console.log(`Do you mean is "${program.commands[maxIndex].name()}" command`);
        }
    });

    // enable debug mode
    program.on("option:debug", () => {
        log.setLogLevel("debug");
    });


    program.on("option:testPath", () => {
        process.env.LOCAL_DEV_PATH = program.opts().testPath;
    });

    program.parse(process.argv);
}

const CatchGlobalErrors = () => {
    const printErrorInfo = (error: Error) => {
        log.error(error.stack || error.message);
        process.exit(1);
    }
    process.on("uncaughtException", printErrorInfo);
    process.on("unhandledRejection", printErrorInfo)
}

(
    async () => {
        CatchGlobalErrors()
        try {
            await prepare();
            registerCommand()
        } catch (e) {
            log.error((e as Error).stack);
            process.exit(1);
        }

    }
)()