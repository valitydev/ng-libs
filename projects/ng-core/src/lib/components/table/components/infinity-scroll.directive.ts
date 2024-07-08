import {
    Directive,
    ElementRef,
    OnInit,
    output,
    DestroyRef,
    input,
    booleanAttribute,
    Injector,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, debounceTime, switchMap, EMPTY } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
    selector: '[vInfinityScroll]',
    standalone: true,
})
export class InfinityScrollDirective implements OnInit {
    vInfinityScroll = input(true, { transform: booleanAttribute });
    vInfinityScrollSkip = input(false, { transform: booleanAttribute });

    vInfinityScrollMore = output();

    constructor(
        private elementRef: ElementRef,
        private dr: DestroyRef,
        private injector: Injector,
    ) {}

    ngOnInit() {
        const el = this.elementRef.nativeElement;
        toObservable(this.vInfinityScroll, { injector: this.injector })
            .pipe(
                switchMap((enabled) => (enabled ? fromEvent<Event>(el, 'scroll') : EMPTY)),
                debounceTime(500),
                switchMap(() =>
                    toObservable(this.vInfinityScrollSkip, { injector: this.injector }),
                ),
                filter((skip) => !skip),
                takeUntilDestroyed(this.dr),
            )
            .subscribe(() => {
                if (this.checkNeedToLoadMore(el)) {
                    this.vInfinityScrollMore.emit();
                }
            });
    }

    reset() {
        this.elementRef.nativeElement.scrollTo(0, 0);
    }

    private checkNeedToLoadMore(el: HTMLElement) {
        const buffer = el.clientHeight;
        return el.scrollTop > el.scrollHeight - el.clientHeight - buffer;
    }
}
