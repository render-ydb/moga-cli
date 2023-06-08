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
const chalk = require("chalk");
const semver = require("semver");
const validateProjectName = require("validate-npm-package-name");
// import { log } from "render-utils";
const render_command_1 = require("render-command");
const inquirer = require("inquirer");
const prompt = inquirer.prompt;
class InitCommand extends render_command_1.Command {
    constructor(rest, options, cmd) {
        super(rest, options, cmd);
        this.force = false;
        this.needUpdate = null;
        this.appName = null;
        this.appVersion = null;
        this.pkgName = null;
        this.package = null;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const { force, update } = this.options;
            this.force = force;
            this.needUpdate = !update;
            const { pkgName, appName, appVersion } = yield this.getAppInfo();
            this.appName = appName;
            this.pkgName = pkgName;
            this.appVersion = appVersion;
        });
    }
    getAppInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                pkgName: yield this.getAppType(),
                appName: yield this.getAppName(),
                appVersion: yield this.getAppVersion(),
            };
        });
    }
    getAppType() {
        return __awaiter(this, void 0, void 0, function* () {
            const { pkgName } = yield prompt({
                type: "list",
                name: "pkgName",
                message: "Please select the application type",
                default: "BSOLUTION_ADMIN_SYSTEM",
                choices: [
                    { name: "moka-component", value: "COMPONENT_DEMO" },
                ],
            });
            return pkgName;
        });
    }
    getAppName() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appName } = yield prompt({
                type: "input",
                name: "appName",
                default: "moka-app",
                message: "Please enter the applicaiton name:",
                validate(name) {
                    const done = this.async();
                    setTimeout(() => {
                        const validationResult = validateProjectName(name);
                        if (!validationResult.validForNewPackages) {
                            const errMsg = [];
                            const tips = "\n   Please enter a new name";
                            [
                                ...(validationResult.errors || []),
                                ...(validationResult.warnings || []),
                            ].forEach((error) => {
                                errMsg.push(`\n   * ${error}`);
                            });
                            done(chalk.red("The application name " +
                                chalk.blue.bold(`'${name}'`) +
                                " does not follow the npm package naming convention:" +
                                errMsg.join("") +
                                tips));
                            return;
                        }
                        done(null, true);
                    }, 0);
                },
            });
            return appName;
        });
    }
    getAppVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appVersion } = yield prompt({
                type: "input",
                name: "appVersion",
                default: "1.0.0",
                message: "Please enter the application version:",
                validate(value) {
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
        });
    }
    exec() {
    }
}
module.exports = (rest, options, cmd) => {
    return new InitCommand(rest, options, cmd);
};
