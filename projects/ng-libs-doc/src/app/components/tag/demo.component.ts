import { Component } from '@angular/core';
import { TagModule } from '@vality/ng-core';

@Component({
    standalone: true,
    template: `<v-tag>Tag</v-tag>`,
    imports: [TagModule],
})
export class DemoComponent {}
