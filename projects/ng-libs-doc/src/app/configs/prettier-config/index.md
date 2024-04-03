# {{ NgDocPage.title }}

![NPM Version](https://img.shields.io/npm/v/prettier?logo=prettier&label=prettier)
![NPM Version](https://img.shields.io/npm/v/%40vality%2Fprettier-config?logo=npm&label=%40vality%2Fprettier-config)

> [Prettier](https://prettier.io/) - a code formatter

## Installation

You need to install the library itself

```shell
npm i -D prettier
```

And this ready-made configuration

```shell
npm i -D @vality/prettier-config
```

### Configuration

`.prettierrc.js`

```js
module.exports = require('@vality/prettier-config');
```

Example `.prettierignore`

```
LICENSE

.*

package-lock.json
node_modules
```

## Handy commands for NPM

```json
{
    "scripts": {
        "format": "prettier \"**\" --list-different",
        "format:fix": "prettier \"**\" --write --log-level warn"
    }
}
```
