import * as path from 'path'
import * as tempy from 'tempy'

export const REMOTE_NAME = 'origin'
export const MODULE_DIR = process.cwd()
export const TMP_DIR = tempy.directory()
export const TMP_PACKAGE_DIR = path.join(TMP_DIR, 'package')
export const PACKAGE_JSON = require(path.join(MODULE_DIR, 'package.json'))
export const REMOTE_URL_TYPES = {
    SSH: 'ssh',
    GIT_SSH: 'git+ssh',
    SSH_GIT: 'ssh+git',
    FTP: 'ftp',
    FTPS: 'ftps',
    HTTPS: 'https',
    HTTP: 'http',
} as const
