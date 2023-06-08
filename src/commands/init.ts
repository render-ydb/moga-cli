
import Package = require("render-package");
import chalk = require("chalk");
import semver = require("semver");

import validateProjectName = require("validate-npm-package-name");
// import { log } from "render-utils";
import { Command, CommandType, Json } from "render-command";


interface Options {
    force: boolean
    update: boolean
}
const inquirer = require("inquirer")
const prompt = inquirer.prompt;
class InitCommand extends Command {
    force: boolean;
    needUpdate: boolean;
    appName: string;
    appVersion: string;
    pkgName: string;
    package: Package;

    constructor(rest: Json, options: Options, cmd: CommandType) {
        super(rest, options, cmd);
        this.force = false;
        this.needUpdate = null;
        this.appName = null;
        this.appVersion = null;
        this.pkgName = null;
        this.package = null;
        this.init()
    }
    async init() {
        const { force, update } = this.options;
        this.force = force;
        this.needUpdate = !update;
        const { pkgName, appName, appVersion } = await this.getAppInfo();
        this.appName = appName;
        this.pkgName = pkgName;
        this.appVersion = appVersion;
    }

    async getAppInfo() {
        return {
            pkgName: await this.getAppType(),
            appName: await this.getAppName(),
            appVersion: await this.getAppVersion(),
        };
    }

    async getAppType(): Promise<string> {
        const { pkgName }: { pkgName: string } = await
            prompt({
                type: "list",
                name: "pkgName",
                message: "Please select the application type",
                default: "BSOLUTION_ADMIN_SYSTEM",
                choices: [
                    { name: "moka-component", value: "COMPONENT_DEMO" },
                ],

            });

        return pkgName;
    }

    async getAppName(): Promise<string> {
        const { appName }: { appName: string } = await
            prompt({
                type: "input",
                name: "appName",
                default: "moka-app",
                message: "Please enter the applicaiton name:",
                validate(name: string) {
                    const done = this.async();
                    setTimeout(() => {
                        const validationResult = validateProjectName(name);
                        if (!validationResult.validForNewPackages) {
                            const errMsg: string[] = [];
                            const tips = "\n   Please enter a new name";
                            [
                                ...(validationResult.errors || []),
                                ...(validationResult.warnings || []),
                            ].forEach((error) => {
                                errMsg.push(`\n   * ${error}`);
                            });
                            done(chalk.red(
                                "The application name " +
                                chalk.blue.bold(`'${name}'`) +
                                " does not follow the npm package naming convention:" +
                                errMsg.join("") +
                                tips
                            ));
                            return;
                        }
                        done(null, true);
                    }, 0);
                },
            });
        return appName;
    }

    async getAppVersion(): Promise<string> {
        const { appVersion }: { appVersion: string } =
            await
                prompt({
                    type: "input",
                    name: "appVersion",
                    default: "1.0.0",
                    message: "Please enter the application version:",
                    validate(value: string) {
                        const done = this.async();
                        setTimeout(() => {
                            if (!semver.valid(value)) {
                                done(chalk.red("Please enter a valid version"));
                                return;
                            }
                            done(null, true);
                        }, 0);
                    },
                });
        return appVersion;
    }

    exec(): void {

    }
}

export = (rest: Json, options: Options, cmd: CommandType) => {
    return new InitCommand(rest, options, cmd)
}
