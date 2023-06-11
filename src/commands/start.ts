import { Command, CommandType, Json } from "render-command";
import { spawn } from "child_process";
import { log } from "render-utils";
import chalk from "chalk";

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
        const builder = spawn("npx", ["render-builder", "start", ...nProcessArgv]);
        builder.stdout.on("data", (data: Buffer) => {
            console.log(data.toString())
        })


        builder.stderr.on("data", (data: Buffer) => {
            console.log(chalk.red(data.toString()))
        })
    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new StartCommand(rest, options, cmd)
}
