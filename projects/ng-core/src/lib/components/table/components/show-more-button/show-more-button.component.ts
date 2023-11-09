import { Component, EventEmitter, Input, Output } from '@angular/core';
import { coerceBoolean } from 'coerce-property';

@Component({
    selector: 'v-show-more-button',
    templateUrl: './show-more-button.component.html',
    styleUrls: ['./show-more-button.component.scss'],
})
export class ShowMoreButtonComponent {
    @Input() @coerceBoolean disabled = false;
    @Input() @coerceBoolean progress = false;
    @Input() displayedPages = 0;
    @Input() pageSize = 0;
    @Input() length = 0;

    @Output() more = new EventEmitter<void>();

    get shown() {
        return Math.min(this.length, this.displayedPages * this.pageSize);
    }
}
