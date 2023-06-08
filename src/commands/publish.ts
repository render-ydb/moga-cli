import { Command, CommandType, Json } from "render-command";

class PublishCommand extends Command {
    options: Json;

    constructor(rest: Json, options: Json, cmd: CommandType) {
        super(rest, options, cmd)
    }
    init(): void {
        console.log("todo")
    }

    exec(): void {

    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new PublishCommand(rest, options, cmd)
}
