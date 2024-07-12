import { inject, Injector, runInInjectionContext } from '@angular/core';
import { switchMap } from 'rxjs';

import { PossiblyAsync, getPossiblyAsyncObservable } from '../../../utils';
import { Value } from '../../value';
import { Column2, CellFnArgs } from '../types';

import { createUniqueColumnDef } from './create-unique-column-def';

export function createColumn<P, A extends object>(
    createCell: (cellParams: P, ...args: CellFnArgs<A>) => PossiblyAsync<Value>,
    columnObject: Partial<Omit<Column2<object>, 'cell'>>,
) {
    return <T extends A>(
        getCellParams: (...args: CellFnArgs<T>) => PossiblyAsync<P>,
        column?: Partial<Column2<T>>,
    ): Column2<T> => {
        const injector = inject(Injector);
        return {
            field: createUniqueColumnDef(column?.header),
            cell: (...cellArgs) =>
                getPossiblyAsyncObservable(getCellParams(...cellArgs)).pipe(
                    switchMap((cellParams) =>
                        getPossiblyAsyncObservable(
                            runInInjectionContext(injector, () =>
                                createCell(cellParams, ...cellArgs),
                            ),
                        ),
                    ),
                ),
            ...columnObject,
            ...column,
        };
    };
}
