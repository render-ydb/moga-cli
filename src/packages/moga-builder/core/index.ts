import {
    BuilderHooks,
    BuilderOptions,
    BuilderLog,
    CommandName,
    Complier,
    Json,
    BuildConfig,
    PluginInfo,
    PLUGIN_CONTEXT_KEY,
    GetAllWebpackConfigs,
    BuilderTaskConfigActionArgs,
    SetBuilderValue,
    GetBuilderValue,
    PresetInfo,
    WebPackConfigs

} from "../types"
import { SyncHook } from "tapable";
import _ = require("lodash");
import assert = require("assert");

import {
    BUILDER_CONFIG_FILE_TYPE,
} from "../../../constant"

import { getBuildConfig } from "../utils/loadConfig";
import checkPluginsOrPresets = require("../utils/checkPluginsOrPresets");
import resolvePlugins = require("../utils/resolvePlugins");
import resolvePresets = require("../utils/resolvePresets");


import { log, loadPkg } from "render-utils";

import Chain = require("webpack-chain");

export default class Builder {

    buildConfig: BuildConfig

    command: CommandName;

    commandArgs: Json;

    compiler: Complier;

    configFile: string | string[];

    hooks: BuilderHooks;

    rootDir: string;

    pkg: Json;


    cancelBuilderTaskNames: Array<string> = [];

    options: BuilderOptions;

    log: BuilderLog = log;

    buildPlugins: Array<PluginInfo> = [];

    buildPresets: Array<PresetInfo> = [];

    builderTaskConfigFns: Array<BuilderTaskConfigActionArgs> = [];

    builderCacheData: Json = {};

    webpackConfigs: WebPackConfigs = [];

    constructor(options: BuilderOptions) {
        const {
            command,
            configFile = BUILDER_CONFIG_FILE_TYPE,
            rootDir = process.cwd(),
            commandArgs = {},
        } = options || {};

        this.options = options;
        this.command = command;
        this.rootDir = rootDir;
        this.commandArgs = commandArgs;
        this.pkg = loadPkg(rootDir, this.log);
        this.configFile = configFile;
    }

    async setUp() {
        try {
            this.registerHooks();
            await this.resolveBuildConfig();
            await this.resolvePlugins();
            await this.resolvePresets();
            await this.createCompiler();
            await this.runPlugins();
            await this.runPresets();

        } catch (error: any) {
            this.log.error(error.stack);
            process.exit(1);
        }


    }

    registerHooks() {
        const hookargs: any = ["arg1", "arg2", "arg3"];
        this.hooks ={
            beforRun: new SyncHook(),
            afterStartCompile: new SyncHook(hookargs),
            beforeStartDevServer: new SyncHook(hookargs),
            afterStartDevServer: new SyncHook(hookargs),
            beforload: new SyncHook(hookargs),
            afterBuildCompile: new SyncHook(hookargs),
            beforeTestLoad: new SyncHook(hookargs),
            beforeTestRun: new SyncHook(hookargs),
            afterTest: new SyncHook(hookargs),
            failed: new SyncHook(hookargs),
        }
    }

    private async resolveBuildConfig() {
        this.buildConfig = await getBuildConfig(
            {
                rootDir: this.rootDir,
                commandArgs: this.commandArgs,
                pkg: this.pkg,
                logger: this.log,
                configFile: this.configFile,
            },
        );
        return this.buildConfig;
    }

    private async resolvePlugins() {
        const allPlugins = [...(this.buildConfig.plugins || [])];
        checkPluginsOrPresets({ type: "plugins", list: allPlugins });

        this.buildPlugins = await resolvePlugins(
            allPlugins,
            {
                rootDir: this.rootDir,
                logger: this.log
            }
        );
    }

    private async resolvePresets() {
        const allPresets = [...(this.buildConfig.allPresets || [])];
        checkPluginsOrPresets({ type: "presets", list: allPresets });
        this.buildPresets = await resolvePresets(
            allPresets,
            {
                rootDir: this.rootDir,
                logger: this.log
            }
        )
    }

    private async createCompiler() {
        const pluginContext = _.pick(this, PLUGIN_CONTEXT_KEY);
        this.compiler = {
            context: pluginContext,
            hooks: this.hooks,
            log: this.log,
            getAllWebpackConfigs: this.getAllWebpackConfigs,
            setBuilderValue: this.setBuilderValue,
            getBuilderValue: this.getBuilderValue,

            // TODO
            // setmethod
            // applyMethod
            // hasmethod
            // updateUserConfig
            // updateUserConfigAction
            // cli相关的
        }
    }

    private async runPlugins() {

        for (const pluginInfo of this.buildPlugins) {
            const { instance, options, name } = pluginInfo;
            const config = await instance.run(this.compiler, new Chain(), options);
            this.webpackConfigs.push({
                type: "plugin",
                config,
                name
            })
        }

    }

    private async runPresets() {
        for (const preset of this.buildPresets) {
            const plugins = preset.plugins || [];
            const config = new Chain();
            for (const Plugin of plugins) {
                // @ts-ignore
                await Plugin.getConfig(this.compiler, config, preset.options)
            }
            this.webpackConfigs.push({
                type: "preset",
                config,
                name: preset.name
            })
        }
    }


    private getAllWebpackConfigs: GetAllWebpackConfigs = () => {
        return this.webpackConfigs
    }


    private setBuilderValue: SetBuilderValue = (key, value) => {
        this.builderCacheData[key] = value
    }

    private getBuilderValue: GetBuilderValue = (key) => {
        return this.builderCacheData[key]
    }

}

export const createBuilder = async (options: BuilderOptions) => {
    const builder = new Builder(options);
    await builder.setUp();
    return builder
}