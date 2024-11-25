import { Component } from '@angular/core';
import { TableModule, Column } from '@vality/ng-core';

interface User {
    id: number;
    name: string;
    date: Date;
}

@Component({
    template: `
        <v-table
            [columns]="columns"
            [data]="data"
            [sort]="{ active: 'name', direction: 'asc' }"
            sortOnFront
        ></v-table>
    `,
    imports: [TableModule],
})
export class DemoComponent {
    columns: Column<User>[] = [
        { field: 'id' },
        { field: 'name' },
        { field: 'date', cell: { type: 'datetime' } },
    ];
    data: User[] = [
        { id: 12, name: 'Max', date: new Date() },
        { id: 5, name: 'Alex', date: new Date() },
        { id: 9, name: 'Ray', date: new Date() },
    ];
}
