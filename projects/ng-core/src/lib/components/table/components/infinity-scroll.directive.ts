import {
    Directive,
    ElementRef,
    OnInit,
    output,
    OnDestroy,
    booleanAttribute,
    input,
} from '@angular/core';

@Directive({
    selector: '[vInfinityScroll]',
    standalone: true,
})
export class InfinityScrollDirective implements OnInit, OnDestroy {
    vInfinityScroll = input(true, { transform: booleanAttribute });
    vInfinityScrollProgress = input(false, { transform: booleanAttribute });
    vInfinityScrollMore = output();

    observer!: IntersectionObserver;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && !this.vInfinityScrollProgress()) {
                    this.vInfinityScrollMore.emit();
                }
            }
        });
        this.observer.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }
}
