import { EventEmitter } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

export class OnePageTableDataSourcePaginator implements Partial<MatPaginator> {
    pageIndex = 0;
    length = 0;
    pageSize = 0;
    page = new EventEmitter<PageEvent>();
    initialized = new BehaviorSubject(undefined);

    get displayedPages() {
        return this.pageSize / this.partSize;
    }

    constructor(private partSize = 25) {
        this.pageSize = partSize;
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
