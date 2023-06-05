"use strict";
const render_command_1 = require("render-command");
class PublishCommand extends render_command_1.Command {
    constructor(rest, options, cmd) {
        super(rest, options, cmd);
    }
    init() {
        console.log("todo");
    }
    exec() {
    }
}
module.exports = (rest, options, cmd) => {
    return new PublishCommand(rest, options, cmd);
};
