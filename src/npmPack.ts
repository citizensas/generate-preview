import * as child_process from 'child_process'
import {EOL} from 'os'
import {MODULE_DIR, PACKAGE_JSON} from './constants'
import {logger} from './logger'

export function npmPack() {
    logger.verbose(`Packing ${PACKAGE_JSON.name}`)
    return new Promise<string>((resolve, reject) =>
        child_process.exec(`npm_config_loglevel=silent npm pack`, {cwd: MODULE_DIR, maxBuffer: 1024 * 500}, function (
            err,
            stdout
        ) {
            if (err) {
                reject(err)
            } else {
                const lines = stdout.trim().split(EOL)
                let filename
                if (lines.length > 1) {
                    filename = lines.pop()
                } else {
                    filename = lines[0]
                }
                logger.verbose(`Packed into ${filename}`)
                resolve(filename)
            }
        })
    )
}
