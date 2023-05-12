import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { FiltersDialogComponent } from './components/filters-dialog/filters-dialog.component';
import { MoreFiltersButtonComponent } from './components/more-filters-button/more-filters-button.component';
import { FiltersComponent } from './filters.component';
import { DialogModule } from '../dialog';

@NgModule({
    declarations: [FiltersComponent, MoreFiltersButtonComponent, FiltersDialogComponent],
    exports: [FiltersComponent, MoreFiltersButtonComponent],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        DialogModule,
        LayoutModule,
    ],
})
export class FiltersModule {}
