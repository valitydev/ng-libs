import { Component } from '@angular/core';
import { TagModule } from '@vality/ng-core';

@Component({
    standalone: true,
    template: `<v-tag>Tag</v-tag>`,
    imports: [TagModule],
})
export class DemoComponent {}

@Component({
    standalone: true,
    template: `
        <div style="display: flex; gap: 8px">
            <v-tag color="primary">Primary</v-tag>
            <v-tag color="accent">Accent</v-tag>
            <v-tag color="warn">Warn</v-tag>
        </div>
    `,
    imports: [TagModule],
})
export class DemoThemeColorsComponent {}

@Component({
    standalone: true,
    template: `
        <div style="display: flex; gap: 8px">
            <v-tag color="neutral">Neutral</v-tag>
            <v-tag color="pending">Pending</v-tag>
            <v-tag color="success">Success</v-tag>
        </div>
    `,
    imports: [TagModule],
})
export class DemoStatusColorsComponent {}
