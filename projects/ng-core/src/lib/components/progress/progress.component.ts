import { Component, Input } from '@angular/core';

import { Progressable } from '../../types/progressable';

@Component({
    selector: 'v-progress',
    templateUrl: './progress.component.html',
})
export class ProgressComponent implements Progressable {
    @Input() progress: Progressable['progress'];

    get progressMode() {
        return typeof this.progress === 'number' ? 'determinate' : 'indeterminate';
    }

    get progressValue(): number {
        return typeof this.progress === 'number'
            ? Math.min(
                  Math.max(
                      this.progress > 1 ? this.progress : (this.progress as number) * 100,
                      100
                  ),
                  0
              )
            : (undefined as never);
    }
}
