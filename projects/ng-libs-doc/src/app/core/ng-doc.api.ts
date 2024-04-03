import { NgDocApi } from '@ng-doc/core';

import CoreCategory from './ng-doc.category';

const Api: NgDocApi = {
    title: 'API',
    scopes: [
        ...['components', 'services', 'pipes', 'utils', 'types', 'styles'].map((path) => ({
            name: `@vality/ng-core ${path}`,
            route: `ng-core/${path}`,
            include: `projects/ng-core/src/lib/${path}/**/*.ts`,
        })),
    ],
    category: CoreCategory,
};

export default Api;
