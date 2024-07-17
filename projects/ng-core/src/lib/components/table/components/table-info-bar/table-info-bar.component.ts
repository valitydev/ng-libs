import {
    Component,
    input,
    booleanAttribute,
    output,
    numberAttribute,
    OnInit,
    DestroyRef,
    computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatIconButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ActionsModule } from '../../../actions';
import { InputFieldModule } from '../../../input-field';
import { TagModule } from '../../../tag';

@Component({
    selector: 'v-table-info-bar',
    standalone: true,
    imports: [
        MatIcon,
        MatIconButton,
        MatTooltip,
        TagModule,
        MatBadge,
        ActionsModule,
        InputFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: 'table-info-bar.component.html',
    styleUrl: 'table-info-bar.component.scss',
})
export class TableInfoBarComponent implements OnInit {
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    isPreload = input(false, { transform: booleanAttribute });

    size = input(0, { transform: numberAttribute });
    preloadSize = input(0, { transform: numberAttribute });

    count = input<number | undefined | null>(undefined);
    filteredCount = input<number | undefined>(0);
    selectedCount = input<number | undefined>(0);

    filter = input<string>('');
    standaloneFilter = input(false, { transform: booleanAttribute });
    filterChange = output<string>();
    filterControl = new FormControl('', { nonNullable: true });

    downloadCsv = output();
    load = output();
    preload = output();

    countText = computed(() =>
        this.progress()
            ? '...'
            : this.count()
              ? (this.filteredCount() ? this.filteredCount() + '/' : '') +
                (this.hasMore() ? '>' : '') +
                this.count()
              : '0',
    );

    constructor(private dr: DestroyRef) {}

    ngOnInit() {
        this.filterControl.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe((v) => {
            this.filterChange.emit(v);
        });
    }
}
