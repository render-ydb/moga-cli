import fse = require("fs-extra");
import fg = require("fast-glob");
import path = require("path");
import { buildConfig, dynamicImport, log } from "render-utils";
import { Json, ModeConfig, BuildConfig } from "../types";
import deepmerge = require("deepmerge");
import _ = require("lodash");

export const mergeModeConfig = (mode: string, buildConfig: BuildConfig): BuildConfig => {
  if (
    buildConfig.modeConfig &&
    mode &&
    (buildConfig.modeConfig as ModeConfig)[mode]
  ) {
    const {
      plugins,
      ...basicConfig
    } = (buildConfig.modeConfig as ModeConfig)[mode] as BuildConfig;
    const userPlugins = [...buildConfig.plugins];
    if (Array.isArray(plugins)) {
      const pluginKeys = userPlugins.map((pluginInfo) => {
        return Array.isArray(pluginInfo) ? pluginInfo[0] : pluginInfo;
      });
      plugins.forEach((pluginInfo) => {
        const [pluginName] = Array.isArray(pluginInfo)
          ? pluginInfo
          : [pluginInfo];
        const pluginIndex = pluginKeys.indexOf(pluginName);
        if (pluginIndex > -1) {
          // overwrite plugin info by modeConfig
          userPlugins[pluginIndex] = pluginInfo;
        } else {
          // push new plugin added by modeConfig
          userPlugins.push(pluginInfo);
        }
      });
    }
    return { ...buildConfig, ...basicConfig, plugins: userPlugins };
  }
  return buildConfig;
};

export const loadConfig = async (filePath: string, pkg: Json): Promise<BuildConfig> => {
  const isTypeModule = pkg?.type === "module";
  const isJson = filePath.endsWith(".json");

  const isTs = filePath.endsWith(".ts");
  const isJs = filePath.endsWith(".js");

  const isESM = ["mjs", "mts"].some((type) => filePath.endsWith(type))
    || (isTypeModule && ["js", "ts"].some((type) => filePath.endsWith(type)));


  let config: BuildConfig;

  if (isJson) {
    return fse.readJSONSync(filePath, { encoding: "utf8" });
  }

  if (isESM && isJs) {
    config = (await dynamicImport(filePath, true))?.default;
  }

  if (!isESM && isJs) {
    config = require(filePath);
  }

  if (isTs) {
    const code = await buildConfig(filePath, isESM ? "esm" : "cjs");
    config = await executeTypescriptModule(code, filePath, isESM);
  }

  return config;
};

export const getBuildConfig = async ({
  rootDir,
  commandArgs,
  logger,
  pkg,
  configFile,
}: {
  rootDir: string;
  commandArgs: Json;
  pkg: Json;
  logger: typeof log;
  configFile: string | string[];
}): Promise<BuildConfig> => {
  const config = commandArgs.config as string;
  let configPath = "";
  if (config) {
    configPath = path.isAbsolute(config as string)
      ? config
      : path.resolve(rootDir, config);
  } else {
    const [defaultUserConfig] = await fg(configFile, { cwd: rootDir, absolute: true });
    configPath = defaultUserConfig;
  }
  let buildConfig: BuildConfig = {
    plugins: [],
  };

  if (configPath && fse.existsSync(configPath)) {
    try {
      buildConfig = await loadConfig(configPath, pkg);
    } catch (err) {
      logger.error(`Fail to load config file ${configPath}`);
      if (err instanceof Error) {
        logger.error(err.stack);
      } else {
        logger.error(err.toString());
      }
      process.exit(1);
    }
  } else if (configPath) {
    logger.error(`config file${`(${configPath})` || ""} is not exist`);
    process.exit(1);
  } else {
    logger.debug(
      "It's most likely you don't have a config file in root directory!\n" +
      "Just ignore this message if you know what you do; Otherwise, check it by yourself.",
    );
  }

  return mergeModeConfig(commandArgs.mode as string, buildConfig);
};

const executeTypescriptModule = async (code: string, filePath: string, isEsm = true) => {
  const tempFile = `${filePath}.${isEsm ? "m" : "c"}js`;
  let buildConfig = null;
  fse.writeFileSync(tempFile, code);

  delete require.cache[require.resolve(tempFile)];
  try {
    const raw = isEsm ? (await dynamicImport(tempFile, true)) : require(tempFile);
    buildConfig = raw?.default ?? raw;
  } catch (err) {
    fse.unlinkSync(tempFile);
    if (err instanceof Error) {
      err.message = err.message.replace(tempFile, filePath);
      err.stack = err.stack.replace(tempFile, filePath);
    }
    throw err;
  }

  fse.unlinkSync(tempFile);

  return buildConfig;
};

export const mergeConfig = <T>(currentValue: T, newValue: T): T => {
  const isBothArray = Array.isArray(currentValue) && Array.isArray(newValue);
  const isBothObject = _.isPlainObject(currentValue) && _.isPlainObject(newValue);
  if (isBothArray || isBothObject) {
    return deepmerge(currentValue, newValue);
  } else {
    return newValue;
  }
};
