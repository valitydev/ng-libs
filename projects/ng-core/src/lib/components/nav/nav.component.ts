import { NgStyle, NgClass, AsyncPipe } from '@angular/common';
import { Component, input, booleanAttribute, ViewEncapsulation } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { MatNavList, MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isArray } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { UrlService } from '../../services';

export interface Link {
    label: string;
    url: string;
}

@Component({
    selector: 'v-nav',
    styleUrls: ['./nav.component.scss'],
    templateUrl: './nav.component.html',
    standalone: true,
    imports: [
        MatNavList,
        MatListItem,
        RouterLink,
        RouterLinkActive,
        NgStyle,
        NgClass,
        AsyncPipe,
        MatDivider,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
    type = input<'secondary' | undefined>();
    links = input<Link[][], Link[] | Link[][]>([], {
        transform: (v) => (isArray(v[0]) ? (v as never) : [v as never]),
    });
    exact = input(false, { transform: booleanAttribute });

    activeLink$ = combineLatest([
        this.urlService.url$,
        toObservable(this.links),
        toObservable(this.exact),
    ]).pipe(
        map(
            ([url, links, exact]) =>
                links.flat().reduce(
                    (res, link) => {
                        const index = url.indexOf(link.url);
                        if (index !== -1 && (exact ? index === 0 : index < res.index)) {
                            return { index, link };
                        }
                        return res;
                    },
                    { index: Infinity, link: null as never as Link },
                )?.link,
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    constructor(private urlService: UrlService) {}
}
