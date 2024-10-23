import { NgModule } from '@angular/core';

import { TableActionsComponent } from './components/table-actions.component';
import { TableInputsComponent } from './components/table-inputs.component';
import { TableComponent } from './table.component';

@NgModule({
    imports: [TableActionsComponent, TableComponent, TableInputsComponent],
    exports: [TableActionsComponent, TableInputsComponent, TableComponent],
})
export class TableModule {}
