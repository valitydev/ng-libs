import { NgDocPage } from '@ng-doc/core';

import ComponentsCategory from '../ng-doc.category';

import {
    DemoComponent,
    DemoThemeColorsComponent,
    DemoStatusColorsComponent,
} from './demo.component';

const TagPage: NgDocPage = {
    title: `Tag`,
    mdFile: './index.md',
    category: ComponentsCategory,
    demos: { DemoComponent, DemoThemeColorsComponent, DemoStatusColorsComponent },
};

export default TagPage;
