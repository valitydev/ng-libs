import { MatTableDataSource } from '@angular/material/table';

import { OnePageTableDataSourcePaginator } from './one-page-table-data-source-paginator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TableDataSource<T extends object> extends MatTableDataSource<T, any> {
    override get paginator(): OnePageTableDataSourcePaginator {
        return this.__paginator;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private __paginator = new OnePageTableDataSourcePaginator(25);

    constructor() {
        super();
    }
}
