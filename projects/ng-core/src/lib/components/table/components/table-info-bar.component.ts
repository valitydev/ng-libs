import { Component, input, booleanAttribute } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'v-table-info-bar',
    standalone: true,
    imports: [MatProgressBar],
    template: `
        <div class="details">
            Quantity:
            {{
                progress()
                    ? '...'
                    : count()
                      ? count() + (hasMore() ? ' (more available)' : ' (all)')
                      : '0'
            }}
            @if (!progress()) {
                @if (filteredCount()) {
                    | <i>Filtered: {{ filteredCount() }}</i>
                }
                @if (selectedCount()) {
                    | <b>Selected: {{ selectedCount() }}</b>
                }
            }
        </div>
    `,
    styles: `
        .details {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.54);
        }
    `,
})
export class TableInfoBarComponent {
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });

    count = input<number | undefined>(0);
    filteredCount = input<number | undefined>(0);
    selectedCount = input<number | undefined>(0);
}