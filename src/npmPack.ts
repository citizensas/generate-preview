import * as child_process from 'child_process'
import {MODULE_DIR, PACKAGE_JSON} from './constants'
import {logger} from './logger'

export function npmPack() {
    logger.verbose(`Packing ${PACKAGE_JSON.name}`)
    return new Promise<string>((resolve, reject) =>
        child_process.exec(`npm_config_loglevel=silent npm pack`, {cwd: MODULE_DIR, maxBuffer: 1024 * 500}, function(
            err,
            stdout
        ) {
            if (err) {
                reject(err)
            } else {
                const filename = stdout.trim()
                logger.verbose(`Packed into ${filename}`)
                resolve(filename)
            }
        })
    )
}
