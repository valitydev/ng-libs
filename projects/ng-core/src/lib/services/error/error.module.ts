import { NgModule } from '@angular/core';
import { NotificationErrorService } from './notification-error.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [MatSnackBarModule],
    providers: [NotificationErrorService],
})
export class ErrorModule {}
