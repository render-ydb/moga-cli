import { PluginListOrPresetList } from "../types";
import _ = require("lodash");


const checkPluginsOrPresets = ({ type, list }: {type: string;list: PluginListOrPresetList}): void => {
  let flag;
  if (!_.isArray(list)) {
    flag = false;
  } else {
    flag = list.every((v) => {
      let correct = false;
      if (_.isArray(v)) {
        correct = _.isString(v[0]);
      } else if (_.isString(v)) {
        correct = true;
      }
      return correct;
    });
  }
  if (!flag) {
    throw new Error(`${type} did not pass validation`);
  }
};

export = checkPluginsOrPresets;
