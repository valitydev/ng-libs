import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { PipesModule } from '../../pipes';
import { ActionsModule } from '../actions';
import { InputFieldModule } from '../input-field';
import { SwitchButtonModule } from '../switch-button';
import { TagModule } from '../tag';

import { ShowMoreButtonComponent } from './components/show-more-button/show-more-button.component';
import { TableActionsComponent } from './components/table-actions.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableInputsComponent } from './components/table-inputs.component';
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
        MatChipsModule,
        PipesModule,
        TagModule,
        RouterLink,
        MatProgressBarModule,
        MatCheckboxModule,
        MatSortModule,
        InputFieldModule,
        ReactiveFormsModule,
        SwitchButtonModule,
        CdkDrag,
        CdkDropList,
    ],
    declarations: [
        TableComponent,
        TableActionsComponent,
        TableCellComponent,
        ShowMoreButtonComponent,
        TableInputsComponent,
    ],
    exports: [TableComponent, TableActionsComponent, TableInputsComponent],
})
export class TableModule {}
