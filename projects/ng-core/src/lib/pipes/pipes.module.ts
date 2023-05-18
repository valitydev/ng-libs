import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EnumKeyValuesPipe } from './enum-key-values.pipe';
import { EnumKeyPipe } from './enum-key.pipe';
import { EnumKeysPipe } from './enum-keys.pipe';
import { InlineJsonPipe } from './inline-json.pipe';

@NgModule({
    declarations: [InlineJsonPipe],
    exports: [InlineJsonPipe, EnumKeyPipe, EnumKeysPipe, EnumKeyValuesPipe],
    imports: [CommonModule, EnumKeyPipe, EnumKeysPipe, EnumKeyValuesPipe],
})
export class PipesModule {}
