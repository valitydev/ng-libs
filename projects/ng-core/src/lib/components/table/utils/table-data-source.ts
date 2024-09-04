import { EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TableDataSource<T extends object> extends MatTableDataSource<
    T,
    OnePageTableDataSourcePaginator & MatPaginator
> {
    override get paginator() {
        return this.__paginator as OnePageTableDataSourcePaginator & MatPaginator;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private __paginator = new OnePageTableDataSourcePaginator();

    constructor() {
        super();
    }
}

class OnePageTableDataSourcePaginator implements Partial<MatPaginator> {
    pageIndex = 0;
    pageSize = 0;
    page = new EventEmitter<PageEvent>();
    initialized = new BehaviorSubject(undefined);

    get length() {
        return this.pageSize;
    }
    set length(v: number) {}

    get displayedPages() {
        return this.pageSize / this.partSize;
    }

    private partSize!: number;

    constructor(partSize?: number) {
        this.setSize(partSize);
    }

    setSize(partSize = 25) {
        if (partSize !== this.partSize) {
            this.pageSize = this.partSize = partSize;
            this.reload();
        }
    }

    reload() {
        this.pageSize = this.partSize;
        this.update();
    }

    more() {
        this.pageSize += this.partSize;
        this.update();
    }

    private update() {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
        });
    }
}
