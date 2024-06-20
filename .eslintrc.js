const config = require('./projects/eslint-config');

const NG_CORE_PATH = 'projects/ng-core/**';
const NG_LIBS_DOC_PATH = 'projects/ng-libs-doc/**';

module.exports = {
    extends: '@vality/eslint-config-ng',
    ignorePatterns: ['ng-doc'],
    overrides: [
        ...require('@vality/eslint-config-ng/configs').angular('v', NG_CORE_PATH).overrides,
        ...require('@vality/eslint-config-ng/configs').angular('app', NG_LIBS_DOC_PATH).overrides,
    ],
};
