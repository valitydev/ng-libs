import { EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TableDataSource<T extends object> extends TableVirtualScrollDataSource<T> {
    override get paginator() {
        return this.__paginator as never;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private __paginator = new OnePageTableDataSourcePaginator();

    constructor() {
        super();
    }
}

class OnePageTableDataSourcePaginator implements Partial<MatPaginator> {
    pageIndex = 0;
    pageSize = Number.MAX_SAFE_INTEGER;
    page = new EventEmitter<PageEvent>();
    initialized = new BehaviorSubject(undefined);
    length = Number.MAX_SAFE_INTEGER;

    update() {
        this.page.next({
            pageIndex: 0,
            pageSize: Number.MAX_SAFE_INTEGER,
            length: Number.MAX_SAFE_INTEGER,
        });
    }
}
