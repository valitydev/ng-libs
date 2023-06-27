import { MenuColumn } from '../types/column';

export function createOperationColumn<T extends object>(
    items: MenuColumn<T>['typeParameters']['items'],
    other?: Partial<MenuColumn<T>>
): MenuColumn<T> {
    return {
        typeParameters: { ...(other?.typeParameters || {}), items },
        field: '__operation',
        header: '',
        pinned: 'right',
        width: '0',
        type: 'menu',
        ...other,
    };
}
