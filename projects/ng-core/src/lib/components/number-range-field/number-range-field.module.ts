import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { NumberRangeFieldComponent } from './number-range-field.component';

@NgModule({
    declarations: [NumberRangeFieldComponent],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule],
    exports: [NumberRangeFieldComponent],
})
export class NumberRangeFieldModule {}
