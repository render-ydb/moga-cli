"use strict";
const npmlog = require("npmlog");
const chalk = require("chalk");
const logLevel = process.env.LOG_LEVEL;
const envs = ['debug', 'info', 'error', 'warn'];
npmlog.level = envs.includes(logLevel) ? logLevel : 'info';
const info = (msg, prefix = '') => {
    npmlog.info(prefix, msg);
};
const error = (msg, prefix = '') => {
    npmlog.error(chalk.red(prefix), chalk.red(msg));
};
const warn = (msg, prefix = '') => {
    npmlog.warn(prefix, msg);
};
const debug = (msg, prefix = '') => {
    npmlog.verbose(prefix, msg);
};
module.exports = {
    info,
    error,
    warn,
    debug
};
