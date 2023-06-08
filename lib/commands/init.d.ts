import Package = require("render-package");
import { Command, CommandType, Json } from "render-command";
interface Options {
    force: boolean;
    update: boolean;
}
declare class InitCommand extends Command {
    force: boolean;
    needUpdate: boolean;
    appName: string;
    appVersion: string;
    pkgName: string;
    package: Package;
    constructor(rest: Json, options: Options, cmd: CommandType);
    init(): Promise<void>;
    getAppInfo(): Promise<{
        pkgName: string;
        appName: string;
        appVersion: string;
    }>;
    getAppType(): Promise<string>;
    getAppName(): Promise<string>;
    getAppVersion(): Promise<string>;
    exec(): void;
}
declare const _default: (rest: Json, options: Options, cmd: CommandType) => InitCommand;
export = _default;
