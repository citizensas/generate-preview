export interface IFlags {
    verbose: boolean
    remoteName: string
    protocol: string
}

let flags: IFlags

export function setFlags(cliFlags: IFlags) {
    flags = cliFlags
}
export function getFlags(): IFlags {
    return flags
}
