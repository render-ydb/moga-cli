import npmlog =require('npmlog');
import chalk =require('chalk');
const logLevel = process.env.LOG_LEVEL;
const envs = ['debug', 'info', 'error', 'warn'];
npmlog.level = envs.includes(logLevel) ? logLevel : 'info';

const info = (msg:string,prefix:string='')=>{
    npmlog.info(prefix,msg)
}

const error = (msg:string,prefix:string='')=>{
    npmlog.error(chalk.red(prefix),chalk.red(msg))
}

const warn = (msg:string,prefix:string='')=>{
    npmlog.warn(prefix,msg)
}

const debug = (msg:string,prefix:string='')=>{
    npmlog.verbose(prefix,msg)
}
export = {
   info,
   error,
   warn,
   debug
}