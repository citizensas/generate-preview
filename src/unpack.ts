import * as tar from 'tar'
import {PACKAGE_JSON, TMP_DIR, TMP_PACKAGE_DIR} from './constants'
import {logger} from './logger'

export function unpack(packedFilename: string) {
    logger.verbose(`Unpacking ${packedFilename} into ${TMP_DIR}`)
    return tar
        .x({
            file: packedFilename,
            cwd: TMP_DIR
        })
        .then(result => {
            logger.verbose(`Package "${PACKAGE_JSON.name}" unpacked in ${TMP_PACKAGE_DIR}`)
            return result
        })
}
