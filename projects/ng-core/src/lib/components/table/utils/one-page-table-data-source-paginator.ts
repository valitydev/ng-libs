import { EventEmitter } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

export class OnePageTableDataSourcePaginator implements Partial<MatPaginator> {
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
