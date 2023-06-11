import { Command, CommandType, Json } from "render-command";
import { spawn } from "child_process";

class StartCommand extends Command {
    options: Json;

    constructor(rest: Json, options: Json, cmd: CommandType) {
        super(rest, options, cmd);
        this.exec();
    }
    init(): void {
        // TODO
    }

    exec(): void {
        const nProcessArgv = process.argv.slice(2);
        spawn("npx", ["render-builder", "start", ...nProcessArgv],{
            stdio:["inherit","inherit","inherit"]
        });
    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new StartCommand(rest, options, cmd)
}
