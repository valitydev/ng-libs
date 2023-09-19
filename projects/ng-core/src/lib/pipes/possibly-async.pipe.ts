import { Pipe, PipeTransform } from '@angular/core';

import { AsyncTransform } from '../utils';

@Pipe({
    standalone: true,
    name: 'vPossiblyAsync',
    pure: false,
})
export class VPossiblyAsyncPipe<T> extends AsyncTransform<T> implements PipeTransform {}
