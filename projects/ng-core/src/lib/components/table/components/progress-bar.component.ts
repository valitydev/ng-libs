import { Component, input, booleanAttribute } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'v-progress-bar',
    standalone: true,
    imports: [MatProgressBar],
    template: `
        @if (progress()) {
            <mat-progress-bar class="progress-bar" mode="indeterminate"></mat-progress-bar>
        }
    `,
    styles: `
      .progress-bar {
        position: absolute;
        z-index: 999;
      }
    `,
})
export class ProgressBarComponent {
    progress = input(false, { transform: booleanAttribute });
}
