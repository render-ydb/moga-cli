
import { log } from "render-utils";
import { Command, CommandType, Json } from 'render-command';


class InitCommand extends Command {
    options: Json;

    constructor(rest: Json, options: Json, cmd: CommandType) {
        super(rest, options, cmd);
        this.init()
    }
    init(): void {
        log.debug("init",process.env.LOG_LEVEL)
    }

    exec(): void {

    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new InitCommand(rest, options, cmd)
}
