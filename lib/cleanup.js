const Ora = require('ora')
const rimraf = require('rimraf')

module.exports = function(pathsToRemove) {
    const spinner = new Ora()
    const promises = []
    spinner.start('Cleaning up')
    const rimrafSpinner = new Ora()
    rimrafSpinner.indent = 2
    rimrafSpinner.start()
    pathsToRemove.forEach(path => {
        rimrafSpinner.text = `Removing ${path}`
        promises.push(
            new Promise((resolve, reject) => {
                rimraf(path, err => {
                    if (err) {
                        rimrafSpinner.fail(err)
                        reject(err)
                    } else {
                        rimrafSpinner.stop()
                        rimrafSpinner.clear()
                        resolve()
                    }
                })
            })
        )
    })
    return Promise.all(promises).then(
        () => {
            spinner.succeed()
            return Promise.resolve()
        },
        err => {
            spinner.fail()
            throw err
        }
    )
}
