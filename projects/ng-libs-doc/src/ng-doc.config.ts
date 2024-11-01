import { NgDocConfiguration } from '@ng-doc/builder';
import { CONFIG } from './config';

const Config: NgDocConfiguration = {
    repoConfig: {
        url: CONFIG.repoUrl,
        mainBranch: 'master',
        releaseBranch: 'master',
    },
};

export default Config;
