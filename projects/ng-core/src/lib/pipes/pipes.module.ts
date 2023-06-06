import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AmountCurrencyPipe } from './amount-currency.pipe';
import { EnumKeyValuesPipe } from './enum-key-values.pipe';
import { EnumKeyPipe } from './enum-key.pipe';
import { EnumKeysPipe } from './enum-keys.pipe';
import { InlineJsonPipe } from './inline-json.pipe';
import { VSelectPipe } from './select.pipe';

@NgModule({
    declarations: [InlineJsonPipe],
    exports: [
        InlineJsonPipe,
        EnumKeyPipe,
        EnumKeysPipe,
        EnumKeyValuesPipe,
        AmountCurrencyPipe,
        VSelectPipe,
    ],
    imports: [
        CommonModule,
        EnumKeyPipe,
        EnumKeysPipe,
        EnumKeyValuesPipe,
        AmountCurrencyPipe,
        VSelectPipe,
    ],
})
export class PipesModule {}
