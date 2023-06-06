import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { InputFieldComponent } from './input-field.component';

@NgModule({
    declarations: [InputFieldComponent],
    exports: [InputFieldComponent],
    imports: [CommonModule, MatInputModule, ReactiveFormsModule],
})
export class InputFieldModule {}
