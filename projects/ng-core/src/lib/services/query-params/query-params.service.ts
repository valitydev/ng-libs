import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { omit } from 'lodash-es';
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
    params$: Observable<Partial<T>>;
    params: Partial<T>;
    set: (params: T, options?: SerializeOptions) => Promise<boolean>;
    patch: (params: Partial<T>, options?: SerializeOptions) => Promise<boolean>;
}

export interface QueryParamsNamespace<T extends object> extends BaseQueryParams<T> {
    destroy: () => void;
}

const NS_PARAM_ID = '_$NS';

@Injectable({ providedIn: 'root' })
export class QueryParamsService<P extends object = NonNullable<unknown>>
    implements BaseQueryParams<P>
{
    params$: Observable<P> = defer(() => this.allParams$).pipe(
        map(() => this.params),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    get params(): P {
        return omit(this.getAllParams(), NS_PARAM_ID) as P;
    }

    private allParams$ = this.router.events.pipe(
        startWith(null),
        skipWhile(() => !this.router.navigated),
        map(() => JSON.stringify(this.route.snapshot.queryParams)),
        distinctUntilChanged(isEqual),
        map(() => this.getAllParams()),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

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

    createNamespace<TNamespaceParams extends object>(
        ns: string,
    ): QueryParamsNamespace<TNamespaceParams> {
        const getNamespaceParams = (): Partial<TNamespaceParams> => this.getNsParams(ns);
        return {
            params$: this.allParams$.pipe(
                map(() => getNamespaceParams()),
                shareReplay({ refCount: true, bufferSize: 1 }),
            ),
            get params() {
                return getNamespaceParams();
            },
            set: async (params, options = {}): Promise<boolean> => {
                return await this.setNsParams(params, ns, options);
            },
            patch: async (params, options = {}): Promise<boolean> => {
                return await this.setNsParams(params, ns, { ...options, isPatch: true });
            },
            destroy: async () => {
                await this.setNsParams({}, ns);
            },
        };
    }

    private async setParams(params: Partial<P>, options: SetOptions = {}): Promise<boolean> {
        const allParams = this.getAllParams();
        let serializeParams: Partial<P>;
        if (options.isPatch) {
            serializeParams = { ...allParams, ...params };
        } else {
            const namespacesParams: P = (allParams as never)?.[NS_PARAM_ID];
            serializeParams = Object.assign(
                {},
                params,
                !!namespacesParams && { [NS_PARAM_ID]: namespacesParams },
            );
        }
        return await this.router.navigate([], {
            queryParams: this.serialize(serializeParams, options),
        });
    }

    private async setNsParams<TNamespaceParams extends object, Namespace extends string = string>(
        params: Partial<TNamespaceParams>,
        ns: Namespace,
        options: SetOptions = {},
    ): Promise<boolean> {
        const allParams = this.getAllParams();
        const allNsParams = (allParams?.[NS_PARAM_ID] ?? {}) as Record<
            Namespace,
            Partial<TNamespaceParams>
        >;
        let serializeParams: Partial<TNamespaceParams>;
        if (options.isPatch) {
            const nsParams = allNsParams[ns] || {};
            serializeParams = { ...nsParams, ...params };
        } else {
            serializeParams = params;
        }
        return await this.router.navigate([], {
            queryParams: this.serialize(
                {
                    ...allParams,
                    [NS_PARAM_ID]: clean({ ...allNsParams, [ns]: serializeParams }, true, true),
                },
                options,
            ),
        });
    }

    private getNsParams<TNamespaceParams extends object>(ns: string): Partial<TNamespaceParams> {
        return (
            (this.getAllParams()[NS_PARAM_ID]?.[ns as never] as never) ?? ({} as TNamespaceParams)
        );
    }

    private getAllParams(): P & { [N in typeof NS_PARAM_ID]?: object } {
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

    private deserialize(params: Params): P & { [N in typeof NS_PARAM_ID]?: object } {
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
