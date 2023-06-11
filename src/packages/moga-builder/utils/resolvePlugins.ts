import { PluginInfo, PluginListOrPresetList, Json, PluginClass } from "../types";
import { dynamicImport, log } from "render-utils";
import _ = require("lodash");
import path = require("path");


const resolvePlugins = async (
  allPlugins: PluginListOrPresetList,
  {
    rootDir,
    logger,
  }: {
    rootDir: string;
    logger: typeof log;
  },
): Promise<PluginInfo[]> => {
  const buildPlugins = await Promise.all(allPlugins.map(
    async (plugin): Promise<PluginInfo> => {
      let instance: PluginClass;
      const plugins = Array.isArray(plugin)
        ? plugin
        : [plugin, undefined];
      const pluginPath = path.isAbsolute(plugins[0] as string)
        ? plugins[0]
        : require.resolve(plugins[0] as string, { paths: [rootDir] });
      const options = plugins[1] as Json;
      try {
        let Plugin = await dynamicImport(pluginPath as string);
        Plugin = Plugin.default ?? Plugin;
        instance = new Plugin();
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Fail to load plugin ${pluginPath}`);
          logger.error(err.stack || err.toString());
          process.exit(1);
        }
      }
      return {
        name: plugins[0] as string,
        pluginPath: pluginPath as string,
        instance,
        options,
      };
    },
  ));
  return buildPlugins;
};

export = resolvePlugins;
