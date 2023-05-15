import { Serializer } from '../types/serializer';

export const DATE_QUERY_PARAMS_SERIALIZERS: Serializer[] = [
    {
        id: 'date',
        serialize: (date: Date) => date.toISOString(),
        deserialize: (value) => new Date(value),
        recognize: (value) => value instanceof Date,
    },
] as Serializer[];
