import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';

@Component({
    selector: 'v-show-more-button',
    templateUrl: './show-more-button.component.html',
    styleUrls: ['./show-more-button.component.scss'],
})
export class ShowMoreButtonComponent {
    @Input({ transform: booleanAttribute }) disabled = false;
    @Input({ transform: booleanAttribute }) progress = false;
    @Input() displayedPages = 0;
    @Input() pageSize = 0;
    @Input() length = 0;

    @Output() more = new EventEmitter<void>();

    get shown() {
        return Math.min(this.length, this.displayedPages * this.pageSize);
    }
}
