import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { Color } from '../../styles';

@Component({
    selector: 'v-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
    @HostBinding('class.v-tag') hostClass: boolean = true;

    @Input() color?: Color;
}
