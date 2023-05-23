import { ViewChild, TemplateRef, Output, EventEmitter, Directive } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { get } from 'lodash-es';
import { Overwrite } from 'utility-types';

import { ExtColumn } from '../../types/column';

@Directive()
export class CellTemplateDirective<T, TColumn extends ExtColumn<T>> {
    @Output() templateChange = new EventEmitter<TemplateRef<unknown>>();

    @ViewChild(TemplateRef, { static: true }) set tpl(tpl: TemplateRef<unknown>) {
        this.templateChange.emit(tpl);
    }

    getValue(col: TColumn, row: T) {
        return col.formatter
            ? col.formatter(row, col as unknown as MtxGridColumn)
            : get(row, col.field);
    }
}

export type TemplateColumn<T, TType extends string, TData extends object> = Overwrite<
    MtxGridColumn<T>,
    {
        type: TType;
    }
> & {
    data: TData;
};
