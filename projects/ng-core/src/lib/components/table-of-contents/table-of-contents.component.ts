import { NgStyle, NgClass, AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatNavList, MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { UrlService } from '../../services';

export interface Link {
    label: string;
    url: string;
}

@Component({
    selector: 'v-table-of-contents',
    styleUrls: ['./table-of-contents.component.scss'],
    templateUrl: './table-of-contents.component.html',
    standalone: true,
    imports: [MatNavList, MatListItem, RouterLink, RouterLinkActive, NgStyle, NgClass, AsyncPipe],
})
export class TableOfContentsComponent {
    links = input<Link[]>([]);

    activeLink$ = combineLatest([this.urlService.url$, toObservable(this.links)]).pipe(
        map(
            ([url, links]) =>
                links.reduce(
                    (res, link) => {
                        const index = url.indexOf(link.url);
                        if (index > 0 && index < res.index) {
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
