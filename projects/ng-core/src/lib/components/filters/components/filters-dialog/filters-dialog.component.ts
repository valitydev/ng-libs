import { Component, TemplateRef } from '@angular/core';

import { DialogSuperclass } from '../../../dialog';

@Component({
    selector: 'v-filters-dialog',
    templateUrl: './filters-dialog.component.html',
    styleUrls: ['./filters-dialog.component.scss'],
})
export class FiltersDialogComponent extends DialogSuperclass<
    FiltersDialogComponent,
    { filters: TemplateRef<unknown> }
> {}
