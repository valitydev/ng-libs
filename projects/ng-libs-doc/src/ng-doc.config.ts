import { NgDocConfiguration } from '@ng-doc/builder';

import * as packageJson from '../../../package.json';

const Config: NgDocConfiguration = {
    repoConfig: {
        url: packageJson.repository.url,
        mainBranch: 'master',
        releaseBranch: 'master',
    },
};

export default Config;
