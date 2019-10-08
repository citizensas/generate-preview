#! /usr/bin/env node

import * as program from 'commander'
import {PACKAGE_JSON, REMOTE_NAME} from './constants'
import {generatePreview} from './generate-preview'

program
    .version(PACKAGE_JSON.version)
    .name('npx generate-preview')
    .option('-r, --remote [name]', 'git remote name to use', REMOTE_NAME)
    .option('-p, --protocol [protocol]', 'git protocol (i.e. git+ssh, https)', 'git+ssh')
    .option('--verbose', 'prints higher level of logs')

program.parse(process.argv)

generatePreview({
    remoteName: program.remote,
    protocol: program.protocol,
    verbose: !!program.verbose
})
