#! /usr/bin/env node

const gitP = require('simple-git/promise')
const semver = require('semver')
const generatePreview = require('./lib/generate-preview')
const packageJson = require('./package')
const program = require('commander')

const REMOTE_NAME = 'origin'

program
    .version(packageJson.version)
    .name('npx generate-preview')
    .option('-r, --remote [name]', 'git remote name to use', REMOTE_NAME)
    .option('-p, --protocol [protocol]', 'git protocol (i.e. git+ssh, https)', 'git+ssh')

program.parse(process.argv)

generatePreview({
    remoteName: program.remote,
    protocol: program.protocol
})
