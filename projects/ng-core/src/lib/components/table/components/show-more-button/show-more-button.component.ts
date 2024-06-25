import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: 'v-show-more-button',
    templateUrl: './show-more-button.component.html',
    styleUrls: ['./show-more-button.component.scss'],
    imports: [MatTooltip, MatButton],
})
export class ShowMoreButtonComponent {
    @Input({ transform: booleanAttribute }) progress = false;
    @Input() displayedPages = 0;
    @Input() pageSize = 0;
    @Input() length = 0;

    @Output() more = new EventEmitter<void>();

    get shown() {
        return Math.min(this.length, this.displayedPages * this.pageSize);
    }
}
