import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ContentChild, TemplateRef } from '@angular/core';
import { map } from 'rxjs/operators';

import { FiltersDialogComponent } from './components/filters-dialog/filters-dialog.component';
import { DialogService } from '../dialog';

@Component({
    selector: 'v-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
    @ContentChild(TemplateRef, { static: true }) contentTemplate!: TemplateRef<unknown>;
    repeat$ = this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
        map((b) => {
            if (b.breakpoints[Breakpoints.XLarge]) return 5;
            if (b.breakpoints[Breakpoints.Large]) return 4;
            if (b.breakpoints[Breakpoints.Medium]) return 3;
            if (b.breakpoints[Breakpoints.Small]) return 2;
            return 1;
        })
    );

    constructor(private dialog: DialogService, private breakpointObserver: BreakpointObserver) {}

    open() {
        this.dialog.open(FiltersDialogComponent, { filters: this.contentTemplate });
    }
}
