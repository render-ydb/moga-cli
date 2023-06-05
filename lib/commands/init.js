"use strict";
const render_command_1 = require("render-command");
class InitCommand extends render_command_1.Command {
    constructor(rest, options, cmd) {
        super(rest, options, cmd);
    }
    init() {
    }
    exec() {
    }
}
module.exports = (rest, options, cmd) => {
    return new InitCommand(rest, options, cmd);
};
