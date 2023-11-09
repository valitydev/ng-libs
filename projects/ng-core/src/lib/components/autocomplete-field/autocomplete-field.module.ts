import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { AutocompleteFieldComponent } from './autocomplete-field.component';

@NgModule({
    declarations: [AutocompleteFieldComponent],
    exports: [AutocompleteFieldComponent],
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
    ],
})
export class AutocompleteFieldModule {}
