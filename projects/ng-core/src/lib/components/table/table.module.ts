import { NgModule } from '@angular/core';

import { TableActionsComponent } from './components/table-actions.component';
import { TableInputsComponent } from './components/table-inputs.component';
import { TableComponent } from './table.component';
import { CustomizeComponent } from './components/customize/customize.component';
import { DialogModule } from '../dialog/dialog.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [CustomizeComponent],
    imports: [
        TableActionsComponent,
        TableComponent,
        TableInputsComponent,
        DialogModule,
        MatButtonModule,
    ],
    exports: [TableActionsComponent, TableInputsComponent, TableComponent],
})
export class TableModule {}
