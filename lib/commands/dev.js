"use strict";
const render_command_1 = require("render-command");
class DevCommand extends render_command_1.Command {
    constructor(rest, options, cmd) {
        super(rest, options, cmd);
    }
    init() {
    }
    exec() {
    }
}
module.exports = (rest, options, cmd) => {
    return new DevCommand(rest, options, cmd);
};
