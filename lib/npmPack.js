const child_process = require('child_process')
const Ora = require('ora')

const constants = require('./constants')
const moduleDir = process.cwd()

module.exports = function() {
    const spinner = new Ora()
    spinner.start(`Packing ${constants.packageJson.name}`)
    return new Promise((resolve, reject) =>
        child_process.exec(`npm pack | tail -1`, {cwd: moduleDir}, function(err, stdout) {
            if (err) {
                spinner.fail(err)
                reject(err)
            } else {
                const filename = stdout.trim()
                spinner.succeed(`Packed into ${filename}`)
                resolve(filename)
            }
        })
    )
}
