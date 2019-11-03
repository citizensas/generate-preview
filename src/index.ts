#! /usr/bin/env node

import * as program from 'commander'
import {REMOTE_NAME} from './constants'
import {generatePreview} from './generate-preview'
import {initLogger} from './logger'
const pkg = require('../package.json')

program
    .version(pkg.version)
    .name('npx generate-preview')
    .option('-r, --remote [name]', 'git remote name to use', REMOTE_NAME)
    .option('-p, --protocol [protocol]', 'git protocol (i.e. git+ssh, https)', 'git+ssh')
    .option('--verbose', 'prints higher level of logs')

program.parse(process.argv)

initLogger(!!program.verbose ? 'verbose' : 'info')

generatePreview({
    remoteName: program.remote,
    protocol: program.protocol
})
