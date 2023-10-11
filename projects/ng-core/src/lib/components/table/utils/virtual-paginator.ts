import { MatTableDataSourcePaginator, MatTableDataSourcePageEvent } from '@angular/material/table';
import { Subject, of } from 'rxjs';

export class VirtualPaginator implements MatTableDataSourcePaginator {
    page = new Subject<MatTableDataSourcePageEvent>();
    pageIndex = 0;
    initialized = of(undefined);
    length = 0;
    pageSize = 0;

    get displayedPages() {
        return this.pageSize / this.partSize;
    }

    constructor(private partSize = 25) {
        this.pageSize = partSize;
    }

    firstPage() {
        return 0;
    }

    lastPage() {
        return 0;
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
