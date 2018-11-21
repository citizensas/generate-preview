#! /usr/bin/env node

const generatePreview = require('./lib/generate-preview')
const packageJson = require('./package')
const program = require('commander')

const REMOTE_NAME = 'origin'

program
    .version(packageJson.version)
    .name('npx generate-preview')
    .option('-r, --remote [name]', 'git remote name to use', REMOTE_NAME)

program.parse(process.argv)

generatePreview(program)
