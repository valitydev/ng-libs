import { MenuValue } from '../../value/components/menu-value.component';
import { MenuColumn } from '../types';
import { createColumn } from '../utils/create-column';
import { createUniqueColumnDef } from '../utils/create-unique-column-def';

export function createOperationColumn<T extends object>(
    items: MenuColumn<T>['typeParameters']['items'],
    other?: Partial<Omit<MenuColumn<T>, 'items'>>,
): MenuColumn<T> {
    return {
        typeParameters: { ...(other?.typeParameters ?? {}), items },
        field: createUniqueColumnDef('operation'),
        header: '',
        pinned: 'right',
        width: '0',
        type: 'menu',
        ...other,
    };
}

// Table 2 Menu Column
export const createMenuColumn = createColumn(
    (params: MenuValue['params']) => {
        return {
            type: 'menu',
            params,
        };
    },
    {
        field: 'menu',
        header: '',
        sticky: 'end',
        style: {
            padding: 0,
        },
    },
);
