import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    input,
    booleanAttribute,
} from '@angular/core';

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

    progress = input(false, { transform: booleanAttribute });
}
