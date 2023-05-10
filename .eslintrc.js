const config = require('./projects/eslint-config');

module.exports = {
    ...config,
    overrides: [
        ...config.overrides,
        ...require('./projects/eslint-config/configs/angular')('v').overrides,
    ],
};
