import { NgModule } from '@angular/core';

import { DATE_QUERY_PARAMS_SERIALIZERS } from './utils/date-query-params-serializers';
import { QUERY_PARAMS_SERIALIZERS } from './utils/query-params-serializers';

@NgModule({
    providers: [{ provide: QUERY_PARAMS_SERIALIZERS, useValue: DATE_QUERY_PARAMS_SERIALIZERS }],
})
export class QueryParamsModule {}
