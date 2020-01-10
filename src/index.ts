#! /usr/bin/env node

import * as program from 'commander'
import {REMOTE_NAME, REMOTE_URL_TYPES} from './constants'
import {generatePreview} from './generate-preview'
import {initLogger, logger} from './logger'
const pkg = require('../package.json')

program
    .version(pkg.version)
    .name('npx generate-preview')
    .option('-r, --remote [name]', 'git remote name to use', REMOTE_NAME)
    .option('-p, --protocol [protocol]', 'git protocol (i.e. git+ssh, https)', REMOTE_URL_TYPES.GIT_SSH)
    .option('--verbose', 'prints higher level of logs')
    .option('--token [token]', 'git user token for remote authentication', '')

program.parse(process.argv)

initLogger(!!program.verbose ? 'verbose' : 'info')
logger.info(`Running generate-preview with version ${pkg.version}`)

generatePreview({
    remoteName: program.remote,
    protocol: program.protocol,
    token: program.token
})
