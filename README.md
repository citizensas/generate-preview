# generate-preview

Get a preview from a git branch before publishing your npm package

## Install

```
$ npm install -D generate-preview
```

or

```
$ yarn add -D generate-preview
```

## Usage

Just put the command in your package.json scripts section.

```metadata json
{
  ...
  "scripts": {
    "preview": "generate-preview"
  },
  ...
}
```

## Flags

| Flag              | Default value | Description                                          |
| :---------------- | :------------ | :--------------------------------------------------- |
| `-b, --branch`    | `origin`      | Specify a custom branch name to be pushed to your repository                               |
| `-r, --remote`    | `origin`      | Git remote name to use                               |
| `-p, --protocole` | `git+ssh`     | Git protocol (i.e. git+ssh, https)                   |
| `--token`         |               | Git user token for remote authentication             |
| `-h, --help`      |               | Prints brief description of generate-preview command |
| `-V, --version`   |               | Prints generate-preview current version installed    |
| `--verbose`       |               | Prints verbose logs                                  |
