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

program.parse(process.argv)

gitP()
    .raw(['--version'])
    .then(string => {
        const version = string.match(/(\d+\.\d+\.\d+)/)
        if (semver.gte(version[1], '2.7.0')) {
            generatePreview({
                remoteName: program.remote
            })
        } else {
            console.error('Git version >=2.7.0 required')
            process.exit(1)
        }
    })
