import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { random } from 'lodash-es';

@Component({
    standalone: true,
    selector: 'v-content-loading',
    templateUrl: './content-loading.component.html',
    styleUrls: ['./content-loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLoadingComponent {
    width = input(random(35, 80) + '%');
    textSize = input(0, { transform: numberAttribute });
    hiddenText = input();
}
