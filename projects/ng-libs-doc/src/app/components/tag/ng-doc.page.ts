import { NgDocPage } from '@ng-doc/core';

import ComponentsCategory from '../ng-doc.category';

import { DemoStatusColorsComponent } from './demo-status-colors.component';
import { DemoThemeColorsComponent } from './demo-theme-colors.component';
import { DemoComponent } from './demo.component';

const TagPage: NgDocPage = {
    title: `Tag`,
    mdFile: './index.md',
    category: ComponentsCategory,
    demos: { DemoComponent, DemoThemeColorsComponent, DemoStatusColorsComponent },
};

export default TagPage;
