import { Command, CommandType, Json } from 'render-command';

class InitCommand extends Command {
    options: Json;

    constructor(rest: Json, options: Json, cmd: CommandType) {
        super(rest, options, cmd)
    }
    init(): void {

    }

    exec(): void {

    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new InitCommand(rest, options, cmd)
}
