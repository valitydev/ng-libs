import { Provider, Type } from '@angular/core';

import { provideValueAccessor } from './provide-value-accessor';

export const createControlProviders = (component: () => Type<unknown>): Provider[] => [
    provideValueAccessor(component),
];
