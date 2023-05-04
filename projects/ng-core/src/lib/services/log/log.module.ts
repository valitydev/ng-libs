import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LogService } from './log.service';

@NgModule({
    imports: [MatSnackBarModule],
    providers: [LogService],
})
export class LogModule {}
