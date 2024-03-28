const config = require('./projects/eslint-config');

const NG_CORE_PATH = 'projects/ng-core/**';
const NG_LIBS_DOC_PATH = 'projects/ng-libs-doc/**';

module.exports = {
    ...config,
    ignorePatterns: [
        ...config.ignorePatterns,
        'ng-doc'
    ],
    overrides: [
        ...config.overrides,
        ...require('./projects/eslint-config/configs/angular')('v', NG_CORE_PATH).overrides,
        ...require('./projects/eslint-config/configs/angular')('app', NG_LIBS_DOC_PATH).overrides,
    ],
};
