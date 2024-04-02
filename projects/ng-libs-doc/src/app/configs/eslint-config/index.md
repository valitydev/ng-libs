# {{ NgDocPage.title }}

![NPM Version](https://img.shields.io/npm/v/eslint?logo=eslint&label=eslint)
![NPM Version](https://img.shields.io/npm/v/%40vality%2Feslint-config?logo=npm&label=%40vality%2Feslint-config)

> [ESLint](https://cspell.org/) - a static code analysis tool for identifying problematic patterns found in JavaScript (TypeScript) code.

## Installation

You need to install the library itself

```shell
npm i -D eslint
```

> Angular requires installation and configuration in the same way
>
> ```shell
> npm i -D @angular-eslint/builder @angular-eslint/schematics
> ```
>
> **Configuration**
>
> `angular.json`
>
> ```json
> {
>     "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
>     "version": 1,
>     "projects": {
>         "app": {
>             "architect": {
>                 "lint": {
>                     "builder": "@angular-eslint/builder:lint",
>                     "options": {
>                         "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
>                     }
>                 }
>             }
>         }
>     }
> }
> ```

And this ready-made configuration

```shell
npm i -D @vality/eslint-config
```

### Configuration

`.eslintrc.js`

```js
module.exports = {
    extends: '@vality/eslint-config',
    overrides: [
        ...require('@vality/eslint-config/configs').angular('app').overrides,
        ...require('@vality/eslint-config/configs').importOrder(['@app/**']).overrides,
    ],
};
```

## Handy commands for NPM

```json
{
    "scripts": {
        "lint": "ng lint --max-warnings=0",
        "lint:fix": "ng lint --fix"
    }
}
```
