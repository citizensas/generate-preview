export interface IFlags {
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
