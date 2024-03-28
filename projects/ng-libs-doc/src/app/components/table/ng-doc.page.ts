import { NgDocPage } from '@ng-doc/core';

import ComponentsCategory from '../ng-doc.category';

import { DemoComponent } from './demo.component';

const TablePage: NgDocPage = {
    title: `Table`,
    mdFile: './index.md',
    category: ComponentsCategory,
    demos: { DemoComponent },
};

export default TablePage;
