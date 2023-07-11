import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { NgLetModule } from 'ng-let';

import { PipesModule } from '../../pipes';
import { ActionsModule } from '../actions';
import { TagModule } from '../tag';

import { TableActionsComponent } from './components/table-actions.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableComponent } from './table.component';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ActionsModule,
        MatTooltipModule,
        MtxGridModule,
        MatChipsModule,
        PipesModule,
        NgLetModule,
        TagModule,
        RouterLink,
    ],
    declarations: [TableComponent, TableActionsComponent, TableCellComponent],
    exports: [TableComponent, TableActionsComponent],
})
export class TableModule {}
