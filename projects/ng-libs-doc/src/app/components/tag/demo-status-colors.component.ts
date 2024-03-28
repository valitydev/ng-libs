import { Component } from '@angular/core';
import { TagModule } from '@vality/ng-core';

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
