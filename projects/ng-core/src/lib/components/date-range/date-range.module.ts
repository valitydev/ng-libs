import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DateRangeComponent } from './date-range.component';
import { ActionsModule } from '../actions';

@NgModule({
    declarations: [DateRangeComponent],
    imports: [
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        ActionsModule,
    ],
    exports: [DateRangeComponent],
})
export class DateRangeModule {}
