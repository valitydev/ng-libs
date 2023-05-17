import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { DateRangeFieldComponent } from './date-range-field.component';
import { ActionsModule } from '../actions';

@NgModule({
    declarations: [DateRangeFieldComponent],
    imports: [
        MatDatepickerModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        ActionsModule,
    ],
    exports: [DateRangeFieldComponent],
})
export class DateRangeFieldModule {}
