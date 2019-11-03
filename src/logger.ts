import {createLogger, format, transports, Logger} from 'winston'

type TLoglevels = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

let logger: Logger

export function initLogger(level: TLoglevels) {
    logger = createLogger({
        level: level,
        format: format.cli(),
        transports: [new transports.Console()]
    })
}

export {logger}
