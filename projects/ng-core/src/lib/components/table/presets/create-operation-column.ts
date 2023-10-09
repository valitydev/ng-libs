import { MenuColumn } from '../types';
import { createInternalColumnField } from '../utils/create-internal-column-field';

export function createOperationColumn<T extends object>(
    items: MenuColumn<T>['typeParameters']['items'],
    other?: Partial<Omit<MenuColumn<T>, 'items'>>,
): MenuColumn<T> {
    return {
        typeParameters: { ...(other?.typeParameters ?? {}), items },
        field: createInternalColumnField('operation'),
        header: '',
        pinned: 'right',
        width: '0',
        type: 'menu',
        ...other,
    };
}
