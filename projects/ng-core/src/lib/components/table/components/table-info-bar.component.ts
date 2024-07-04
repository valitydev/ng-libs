import { Component, input, booleanAttribute, output } from '@angular/core';

@Component({
    selector: 'v-table-info-bar',
    standalone: true,
    imports: [],
    template: `
        <div class="details">
            Quantity:
            {{
                progress()
                    ? '...'
                    : count()
                      ? (filteredCount() ? filteredCount() + '/' : '') +
                        (hasMore() ? '>' : '') +
                        count()
                      : '0'
            }}
            @if (!progress()) {
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

    downloadCsv = output();
}
