import { TemplateRef } from '@angular/core';

import { Color } from '../../../styles';

export type BaseValue<V = unknown> = {
    value?: V;

    description?: string | number | boolean;
    tooltip?: string;
    color?: Color;
    lazy?: boolean;

    click?: (event: MouseEvent) => void;
    link?: (event: MouseEvent) => void;

    template?: TemplateRef<unknown>;
};

export type TypedValue<T, V = unknown> = BaseValue<V> & { type: T };
export type TypedParamsValue<T, P extends object, V = unknown> = TypedValue<T, V> & { params: P };
