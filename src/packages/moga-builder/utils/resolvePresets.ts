import { PresetInfo, PluginListOrPresetList, Json, Preset } from "../types";
import { dynamicImport, log } from "render-utils";
import _ = require("lodash");
import path = require("path");


const resolvePresets = async (
  allPresets: PluginListOrPresetList,
  {
    rootDir,
    logger,
  }: {
    rootDir: string;
    logger: typeof log;
  },
): Promise<PresetInfo[]> => {
  const buildPresets = await Promise.all(allPresets.map(
    async (preset): Promise<PresetInfo> => {
      let Preset: Preset;
      const presets = Array.isArray(preset)
        ? preset
        : [preset, undefined];
      const presetPath = path.isAbsolute(presets[0] as string)
        ? presets[0]
        : require.resolve(presets[0] as string, { paths: [rootDir] });
      const options = presets[1] as Json;
      try {
        const obj = await dynamicImport(presetPath as string);
        Preset = obj.default ?? obj;
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Fail to load preset ${presetPath}`);
          logger.error(err.stack || err.toString());
          process.exit(1);
        }
      }

      if (!_.isFunction(Preset.install)) {
        logger.error(`Fail to load preset ${presetPath}`);
        logger.error("The preset must have an install method.");
        process.exit(1);
      }

      return {
        name: presets[0] as string,
        presetPath: presetPath as string,
        plugins: Preset.install(),
        options,
      };
    },
  ));
  return buildPresets;
};

export = resolvePresets;
