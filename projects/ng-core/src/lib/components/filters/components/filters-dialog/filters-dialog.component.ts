import { Component } from '@angular/core';

import { DialogSuperclass } from '../../../dialog';
import { FiltersComponent } from '../../filters.component';

@Component({
    selector: 'v-filters-dialog',
    templateUrl: './filters-dialog.component.html',
    styleUrls: ['./filters-dialog.component.scss'],
})
export class FiltersDialogComponent extends DialogSuperclass<
    FiltersDialogComponent,
    { filters: FiltersComponent }
> {
    protected readonly Boolean = Boolean;
}
