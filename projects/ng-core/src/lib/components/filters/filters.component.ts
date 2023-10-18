import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { coerceBoolean } from 'coerce-property';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogService } from '../dialog';

import { FiltersDialogComponent } from './components/filters-dialog/filters-dialog.component';
import { MainFiltersDirective } from './components/main-filters/main-filters.directive';
import { OtherFiltersDirective } from './components/other-filters/other-filters.directive';

@Component({
    selector: 'v-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
    @Input() active = 0;
    @Input() @coerceBoolean merge: boolean | '' = false;
    @Output() clear = new EventEmitter<void>();

    @ContentChild(TemplateRef, { static: true }) filtersTemplate!: TemplateRef<unknown>;
    @ContentChild(OtherFiltersDirective, { static: true })
    otherFiltersDirective!: OtherFiltersDirective;
    @ContentChild(MainFiltersDirective, { static: true })
    mainFiltersDirective!: MainFiltersDirective;

    @ViewChild('content') set content(content: ElementRef<HTMLElement>) {
        this.filtersCount$.next(content?.nativeElement?.children?.length ?? 0);
    }

    get mainFiltersTemplate() {
        return this.mainFiltersDirective?.templateRef ?? this.filtersTemplate;
    }

    get otherFiltersTemplate() {
        return this.otherFiltersDirective?.templateRef;
    }

    repeat$ = this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
        map((b) => {
            if (b.breakpoints[Breakpoints.XLarge]) {return 5;}
            if (b.breakpoints[Breakpoints.Large]) {return 4;}
            if (b.breakpoints[Breakpoints.Medium]) {return 3;}
            if (b.breakpoints[Breakpoints.Small]) {return 2;}
            return 1;
        }),
    );

    displayedFiltersCount$ = this.repeat$.pipe(map((r) => r * 2));
    filtersCount$ = new BehaviorSubject(0);

    constructor(
        private dialog: DialogService,
        private breakpointObserver: BreakpointObserver,
    ) {}

    open() {
        this.dialog.open(FiltersDialogComponent, { filters: this });
    }
}
