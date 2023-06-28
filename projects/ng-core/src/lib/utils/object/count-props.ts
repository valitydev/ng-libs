export function countProps<T extends object>(...objects: T[]) {
    return objects.reduce((acc, obj) => acc + (obj ? Object.keys(obj).length : 0), 0);
}
