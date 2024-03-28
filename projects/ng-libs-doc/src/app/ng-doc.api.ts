import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
    title: 'API References',
    keyword: 'ApiReferences',
    scopes: [
        ...['components', 'services', 'pipes', 'utils', 'types', 'styles'].map((path) => ({
            name: `@vality/ng-core ${path}`,
            route: `ng-core/${path}`,
            include: `projects/ng-core/src/lib/${path}/**/*.ts`,
        })),
    ],
};

export default Api;
