const os = require('os')
const child_process = require('child_process')
const gitP = require('simple-git/promise')
const tar = require('tar')
const del = require('del')

const moduleDir = process.cwd()
const packageJson = require(moduleDir + '/package.json')

const REMOTE_NAME = 'origin'
const tmpDir = os.tmpdir()
const tmpPackageDir = `${tmpDir}/package`
const moduleGit = gitP(moduleDir)

Promise.all([
    moduleGit.revparse(['--abbrev-ref', 'HEAD']).then(res => res.trim() + '-dist'),
    moduleGit.raw(['remote', 'get-url', REMOTE_NAME]).then(res => res.trim()),
    new Promise((resolve, reject) =>
        child_process.exec(`npm pack | tail -1`, {cwd: moduleDir}, function(err, stdout) {
            if (err) {
                reject(err)
            } else {
                resolve(stdout.trim())
            }
        })
    )
])
    .then(([distBranchName, REMOTE_URL, packedFilename]) =>
        tar
            .x({
                file: packedFilename,
                cwd: tmpDir
            })
            .then(() => gitP(tmpPackageDir))
            .then(git =>
                git
                    .init()
                    .then(() => git.checkoutLocalBranch(distBranchName))
                    .then(() => git.add(['.']))
                    .then(() => git.commit('bundle update'))
                    .then(() => git.addRemote(REMOTE_NAME, REMOTE_URL))
                    .then(() => git.push(['--force', REMOTE_NAME, distBranchName]))
            )
            .then(() => {
                console.log(`Copy the URL and paste it as version number in your package.json for ${packageJson.name}`)
                console.log(`git+ssh://${REMOTE_URL}#${distBranchName}`)
                return [tmpPackageDir, packedFilename]
            })
            .catch(err => {
                del.sync([tmpPackageDir, packedFilename], {force: true})
                throw err
            })
    )
    .then(dirs => del(dirs, {force: true}))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
