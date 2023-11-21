import { isPrimitive } from 'utility-types';

export function inlineJson(value: unknown, maxReadableLever = 1, isRoot = true): string {
    if (isPrimitive(value)) {
        return String(value);
    }
    if (Array.isArray(value) || value instanceof Map || value instanceof Set) {
        const content =
            maxReadableLever > 0
                ? Array.from(value)
                      .map((v) => inlineJson(v, maxReadableLever, false))
                      .join(', ')
                : Array.from(value).length
                ? '…'
                : '';
        if (value instanceof Set) {
            return `Set(${content})`;
        }
        if (value instanceof Map) {
            return `Map(${content})`;
        }
        return isRoot && content ? content : `[${content}]`;
    }
    if (!Object.keys(value as never).length) {
        return '{}';
    }
    const content =
        maxReadableLever > 0
            ? Object.entries(value as never)
                  .map(([k, v]) => `${k}: ${inlineJson(v, maxReadableLever - 1, false)}`)
                  .join(', ')
            : '…';
    if (isRoot) {
        return content;
    }
    return `{ ${content} }`;
}
