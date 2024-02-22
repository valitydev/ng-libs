import { input, OnInit, viewChild, OnDestroy, OnChanges, Directive, inject } from '@angular/core';
import { MatTable, MatColumnDef } from '@angular/material/table';

import { ComponentChanges } from '../../../utils';

@Directive()
export class BaseColumnComponent implements OnInit, OnChanges, OnDestroy {
    name = input.required<string>();
    columnDef = viewChild(MatColumnDef);
    table = inject(MatTable, { optional: true });

    ngOnInit() {
        if (this.table) {
            const columnDef = this.columnDef();
            if (columnDef) {
                this.updateColumnDefName();
                this.table.addColumnDef(columnDef);
            }
        }
    }

    ngOnChanges(changes: ComponentChanges<BaseColumnComponent>) {
        if (changes.name) {
            this.updateColumnDefName();
        }
    }

    ngOnDestroy() {
        if (this.table) {
            const columnDef = this.columnDef();
            if (columnDef) {
                this.table.removeColumnDef(columnDef);
            }
        }
    }

    private updateColumnDefName() {
        const columnDef = this.columnDef();
        if (columnDef) {
            columnDef.name = this.name();
        }
    }
}
