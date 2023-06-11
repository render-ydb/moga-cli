import { SyncHook } from "tapable";
import WebpackChain from "webpack-chain";
import { log } from "render-utils";

export type BuilderLog = typeof log;

export type Config = WebpackChain;

// base types
export interface Hash<T> {
  [name: string]: T;
}
export type Json = Hash<string | number | boolean | Date | Json | JsonArray>;
export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray>;
export type JsonValue = Json[keyof Json];
export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;

// lifecycle
type Hook = SyncHook<string[]>;

const BUILDER_LIFT_CYCLE = {
  afterStartCompile: "afterStartCompile" as const,
  beforeStartDevServer: "beforeStartDevServer" as const,
  afterStartDevServer: "afterStartDevServer" as const,
  beforload: "beforload" as const,
  beforRun: "beforRun" as const,
  afterBuildCompile: "afterBuildCompile" as const,
  beforeTestLoad: "beforeTestLoad" as const,
  beforeTestRun: "beforeTestRun" as const,
  afterTest: "afterTest" as const,
  failed: "failed" as const,
};
export type BuilderHooks = {
  readonly[x in keyof (typeof BUILDER_LIFT_CYCLE)]: Hook
};

export type CommandName = "start" | "build" | "jest" | string;


export interface BuilderOptions {
  command: string;
  rootDir?: string;
  configFile?: string | string[];
  commandArgs?: Json;
}

export const PLUGIN_CONTEXT_KEY = [
  "command" as const,
  "commandArgs" as const,
  "rootDir" as const,
  "buildConfig" as const,
  "pkg" as const,
];

export type WebPackConfigs = Array<{
  type: "plugin"|"preset";
  config: WebpackChain;
  name: string;
}>;

export interface GetAllWebpackConfigs {
  (): WebPackConfigs;
}


export interface SetBuilderTaskConfigFn {
  (config: WebpackChain): Promise<void | WebpackChain> | void | WebpackChain;
}

export type BuilderTaskConfigActionArgs =
  | [string, SetBuilderTaskConfigFn]
  | [SetBuilderTaskConfigFn];

export type CacheDataKey = string | number;

export interface SetBuilderValue {
  (key: CacheDataKey, value: any): void;
}

export interface GetBuilderValue {
  (key: CacheDataKey): any;
}


export type ValidationKey = "string" | "number" | "boolean" | "object" | "array";

export interface Validation {
  (value: any): boolean;
}


export interface Context {
  rootDir: string;
  command: string;
  commandArgs: Json;
  buildConfig: Json;
  pkg: Json;
}
export interface Complier {
  context: Context;
  hooks: BuilderHooks;
  log: BuilderLog;
  getAllWebpackConfigs: GetAllWebpackConfigs;
  setBuilderValue: SetBuilderValue;
  getBuilderValue: GetBuilderValue;
}

export type PluginOrPreset = string | [string, Json];
export type PluginListOrPresetList = PluginOrPreset[];

export interface Preset {
  install: () => PluginClass[];
}
export interface BuildConfig {
  [key: string]: any;
  plugins?: PluginListOrPresetList;
  presets?: PluginListOrPresetList;
}
export interface ModeConfig {
  [name: string]: BuildConfig;
}

export class PluginClass {
  run(complier: Complier, config: WebpackChain, options: Json): WebpackChain {
    throw new Error("The run method of the plugin must be implemented.");
  }
  static getConfig(complier: Complier, config: WebpackChain, options: Json) {
    return new this().run(complier, config, options);
  }
}

export interface PluginInfo {
  instance: PluginClass;
  name?: string;
  pluginPath?: string;
  options: Json;
}

export interface PresetInfo {
  plugins: PluginClass[];
  name?: string;
  presetPath?: string;
  options: Json;
}


export interface ScriptFn {
  (compiler: Complier, options?: Json): void | Promise<void> | any;
}

