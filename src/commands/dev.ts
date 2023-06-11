import { Command, CommandType, Json } from "render-command";
import {spawn} from "child_process";
import chalk from "chalk";

class DevCommand extends Command {
    options: Json;

    constructor(rest: Json, options: Json, cmd: CommandType) {
        super(rest, options, cmd);
        this.init();
    }
    init(): void {
        const builder = spawn("npx",["render-builder","start"]);

        builder.stdout.on("data",(data:Buffer)=>{
            console.log(data.toString())
        })


        builder.stderr.on("data",(data:Buffer)=>{
            console.error(chalk.red(data.toString()))
        })
    }

    exec(): void {

    }
}

export = (rest: Json, options: Json, cmd: CommandType) => {
    return new DevCommand(rest, options, cmd)
}
