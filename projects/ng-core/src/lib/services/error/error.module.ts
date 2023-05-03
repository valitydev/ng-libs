import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NotificationErrorService } from './notification-error.service';

@NgModule({
    imports: [MatSnackBarModule],
    providers: [NotificationErrorService],
})
export class ErrorModule {}
