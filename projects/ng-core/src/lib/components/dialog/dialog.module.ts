import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DialogActionsComponent } from './components/dialog-actions/dialog-actions.component';
import { DialogComponent } from './dialog.component';
import { DialogService } from './services/dialog.service';
import { ActionsModule } from '../actions';

const SHARED_DECLARATIONS = [DialogComponent, DialogActionsComponent];

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        MatButtonModule,
        ActionsModule,
        MatIconModule,
        MatProgressBarModule,
        MatDialogModule,
    ],
    providers: [DialogService],
    declarations: SHARED_DECLARATIONS,
    exports: SHARED_DECLARATIONS,
})
export class DialogModule {}
