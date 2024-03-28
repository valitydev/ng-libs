import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
    provideNgDocApp,
    provideSearchEngine,
    NgDocDefaultSearchEngine,
    providePageSkeleton,
    NG_DOC_DEFAULT_PAGE_SKELETON,
    provideMainPageProcessor,
    NG_DOC_DEFAULT_PAGE_PROCESSORS,
} from '@ng-doc/app';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated';

import { ROUTES } from './app.routes';

export const APP_CONFIG: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
            [...ROUTES, ...NG_DOC_ROUTING],
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
        ),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideNgDocContext(),
        provideNgDocApp(),
        provideSearchEngine(NgDocDefaultSearchEngine),
        providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
        provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
    ],
};
