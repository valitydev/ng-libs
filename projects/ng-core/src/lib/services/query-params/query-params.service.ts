import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { omit, pick } from 'lodash-es';
import isEqual from 'lodash-es/isEqual';
import negate from 'lodash-es/negate';
import { Observable, defer, skipWhile } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

import { isEmpty, clean } from '../../utils';

import { Serializer } from './types/serializer';
import { QUERY_PARAMS_SERIALIZERS } from './utils';
import { deserializeQueryParam } from './utils/deserialize-query-param';
import { serializeQueryParam } from './utils/serialize-query-param';

interface SerializeOptions {
    filter?: (param: unknown, key: string) => boolean;
}

interface SetOptions extends SerializeOptions {
    isPatch?: boolean;
}

interface BaseQueryParams<T extends object> {
    params$: Observable<T>;
    params: T;
    set: (params: T, options?: SerializeOptions) => Promise<boolean>;
    patch: (params: Partial<T>, options?: SerializeOptions) => Promise<boolean>;
}

export interface QueryParamsNamespace<T extends object> extends BaseQueryParams<T> {
    destroy: () => void;
}

@Injectable({ providedIn: 'root' })
export class QueryParamsService<P extends object = NonNullable<unknown>>
    implements BaseQueryParams<P>
{
    params$: Observable<P> = defer(() => this.allParams$).pipe(
        map(() => this.params),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    get params(): P {
        return omit(this.getAllParams(), Array.from(this.namespaces)) as P;
    }

    private allParams$ = this.router.events.pipe(
        startWith(null),
        skipWhile(() => !this.router.navigated),
        map(() => JSON.stringify(this.route.snapshot.queryParams)),
        distinctUntilChanged(isEqual),
        map(() => this.getAllParams()),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    private namespaces = new Set<string>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Optional() @Inject(QUERY_PARAMS_SERIALIZERS) private readonly serializers?: Serializer[],
    ) {
        if (!this.serializers) {
            this.serializers = [];
        }
    }

    async set(params: P, options: SerializeOptions = {}): Promise<boolean> {
        return await this.setParams(params, options);
    }

    async patch(params: Partial<P>, options: SerializeOptions = {}): Promise<boolean> {
        return await this.setParams(params, { ...options, isPatch: true });
    }

    createNamespace<T extends object>(namespace: string): QueryParamsNamespace<T> {
        const getNamespaceParams = (): T => {
            return (this.getAllParams()[namespace as never] || {}) as T;
        };
        return {
            params$: this.allParams$.pipe(
                map(() => getNamespaceParams()),
                shareReplay({ refCount: true, bufferSize: 1 }),
            ),
            get params() {
                return getNamespaceParams();
            },
            set: async (params, options = {}): Promise<boolean> => {
                return await this.setParams({ [namespace]: clean(params || {}) } as never, {
                    ...options,
                    isPatch: true,
                });
            },
            patch: async (params, options = {}): Promise<boolean> => {
                return await this.setParams(
                    { [namespace]: clean({ ...getNamespaceParams(), ...(params || {}) }) } as never,
                    { ...options, isPatch: true },
                );
            },
            destroy: () => {
                this.namespaces.delete(namespace);
            },
        };
    }

    private async setParams(params: Partial<P>, options: SetOptions = {}): Promise<boolean> {
        const allParams = this.getAllParams();
        let serializeParams: Partial<P>;
        if (options.isPatch) {
            serializeParams = { ...allParams, ...params };
        } else {
            const namespacesParams = pick(allParams, Array.from(this.namespaces));
            serializeParams = { ...namespacesParams, ...params };
        }
        return await this.router.navigate([], {
            queryParams: this.serialize(serializeParams, options),
        });
    }

    private getAllParams() {
        return this.deserialize(this.route.snapshot.queryParams);
    }

    private serialize(params: object, options: SerializeOptions = {}): { [key: string]: string } {
        const filter = options.filter ?? negate(isEmpty);
        return Object.entries(params).reduce(
            (acc, [k, v]) => {
                if (filter(v, k)) {
                    acc[k] = serializeQueryParam(v, this.serializers);
                }
                return acc;
            },
            {} as { [key: string]: string },
        );
    }

    private deserialize(params: Params): P {
        if (!params) {
            return {} as P;
        }
        return Object.entries(params).reduce((acc, [k, v]) => {
            try {
                acc[k as keyof P] = deserializeQueryParam<P[keyof P]>(v, this.serializers);
            } catch (err) {
                console.error(err);
            }
            return acc;
        }, {} as P);
    }
}
