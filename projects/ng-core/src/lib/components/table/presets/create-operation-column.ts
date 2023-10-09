import { MenuColumn } from '../types';

export function createOperationColumn<T extends object>(
    items: MenuColumn<T>['typeParameters']['items'],
    other?: Partial<Omit<MenuColumn<T>, 'items'>>,
): MenuColumn<T> {
    return {
        typeParameters: { ...(other?.typeParameters ?? {}), items },
        field: '__operation',
        header: '',
        pinned: 'right',
        width: '0',
        type: 'menu',
        ...other,
    };
}
