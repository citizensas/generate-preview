import * as tar from 'tar'
import * as ora from 'ora'
import {PACKAGE_JSON, TMP_DIR, TMP_PACKAGE_DIR} from './constants'
import {getFlags} from './cliFlags'

export function unpack(packedFilename: string) {
    const {verbose} = getFlags()
    const spinner = ora()
    verbose && spinner.start(`Unpacking ${packedFilename} into ${TMP_DIR}`)
    return tar
        .x({
            file: packedFilename,
            cwd: TMP_DIR
        })
        .then(
            result => {
                verbose && spinner.succeed(`Package "${PACKAGE_JSON.name}" unpacked in ${TMP_PACKAGE_DIR}`)
                return result
            },
            err => {
                verbose && spinner.fail(err)
                throw err
            }
        )
}
