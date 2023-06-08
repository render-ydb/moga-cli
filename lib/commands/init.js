"use strict";
const render_utils_1 = require("render-utils");
const render_command_1 = require("render-command");
class InitCommand extends render_command_1.Command {
    constructor(rest, options, cmd) {
        super(rest, options, cmd);
        this.init();
    }
    init() {
        render_utils_1.log.debug("init", process.env.LOG_LEVEL);
    }
    exec() {
    }
}
module.exports = (rest, options, cmd) => {
    return new InitCommand(rest, options, cmd);
};
