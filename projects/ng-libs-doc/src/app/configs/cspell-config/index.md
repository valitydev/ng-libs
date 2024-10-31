![NPM Version](https://img.shields.io/npm/v/cspell?logo=npm&label=cspell)
![NPM Version](https://img.shields.io/npm/v/%40vality%2Fcspell-config?logo=npm&label=%40vality%2Fcspell-config)

> [CSPell](https://cspell.org/) - a spell checker for code.

## Installation

You need to install the library itself

```shell
npm i -D cspell
```

And this ready-made configuration

```shell
npm i -D @vality/cspell-config
```

### Configuration

`cspell.json`

```json
{
    "$schema": "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
    "version": "0.2",
    "import": "./node_modules/@vality/cspell-config/cspell.config.js",
    "words": ["some-unknown-word"]
}
```

## Handy commands for NPM

```json
{
    "scripts": {
        "spell": "cspell --no-progress **",
        "spell:fix": "cspell --no-progress --show-suggestions --show-context **"
    }
}
```
