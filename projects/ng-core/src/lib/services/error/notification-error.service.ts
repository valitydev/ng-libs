import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorService } from './types/error-service';

const DEFAULT_DURATION_MS = 6000;

@Injectable({
    providedIn: 'root',
})
export class NotificationErrorService implements ErrorService {
    constructor(private snackBar: MatSnackBar) {}

    error = (error: unknown, clientMessage?: string): void => {
        const name = String((error as { name: unknown })?.name ?? '');
        const message = String((error as { message: unknown })?.message ?? '');
        const result = clientMessage || message || name || 'Unknown error';

        console.warn(
            [
                `⚠️ Caught error: ${clientMessage || 'Unknown error'}.`,
                name && `Name: ${name}.`,
                message && `Message: ${message}.`,
            ]
                .filter(Boolean)
                .join('\n')
        );
        this.snackBar.open(result, 'OK', {
            duration: DEFAULT_DURATION_MS,
        });
    };
}
