import { Command, CommandType, Json } from "render-command";
declare class PublishCommand extends Command {
    options: Json;
    constructor(rest: Json, options: Json, cmd: CommandType);
    init(): void;
    exec(): void;
}
declare const _default: (rest: Json, options: Json, cmd: CommandType) => PublishCommand;
export = _default;