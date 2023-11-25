import chalk from 'chalk'

export const bold = chalk.bold
export const ulLog = chalk.underline
export const ulCyan = chalk.cyanBright.underline
export const errorLog = (text) => console.error(chalk.red(text))
export const successLog = (text) => console.log(chalk.cyanBright(text))
export const infoLog = (text) => console.log(chalk.magentaBright(text))
export const warnLog = (text) => console.warn(chalk.yellow(text))
export const dimLog = (text) => console.log(chalk.dim(text))

export const SALT_ROUNDS = 10
export const LIMIT = 10
