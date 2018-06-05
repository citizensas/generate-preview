const os = require('os')
const child_process = require('child_process')
const simpleGit = require('simple-git/promise')
const tar = require('tar')
const del = require('del')

const moduleDir = process.cwd()
const packageJson = require(moduleDir + '/package.json')

const REMOTE_NAME = 'origin'
const tmpDir = os.tmpdir()
const tmpPackageDir = `${tmpDir}/package`
const moduleSimpleGit = simpleGit(moduleDir)

moduleSimpleGit.revparse(['--abbrev-ref', 'HEAD']).then(res => {
    const distBranchName = res.trim() + '-dist'
    moduleSimpleGit.raw(['remote', 'get-url', REMOTE_NAME]).then(res => {
        const REMOTE_URL = res.trim()

        child_process.exec(`npm pack | tail -1`, {cwd: moduleDir}, function(err, stdout) {
            const packedFilename = stdout.trim()
            let packageSimpleGit
            tar.x({
                file: packedFilename,
                cwd: tmpDir
            })
                .then(() => (packageSimpleGit = simpleGit(tmpPackageDir)))
                .then(() => packageSimpleGit.init())
                .then(() => packageSimpleGit.checkoutLocalBranch(distBranchName))
                .then(() => packageSimpleGit.addRemote(REMOTE_NAME, REMOTE_URL))
                .then(() => packageSimpleGit.add(['.']))
                .then(() => packageSimpleGit.commit('bundle update'))
                .then(() => packageSimpleGit.push(['--force', REMOTE_NAME, distBranchName]))
                .then(() => {
                    console.log(
                        `Copy the URL and paste it as version number in your package.json for ${packageJson.name}`
                    )
                    console.log(`git+ssh://${REMOTE_URL}#${distBranchName}`)
                })

                .catch(err => console.error(err))
                .then(() => del([tmpPackageDir, packedFilename], {force: true}))
        })
    })
})
