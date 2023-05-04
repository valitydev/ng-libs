import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { capitalize } from 'lodash-es';

const DEFAULT_DURATION_MS = 3000;
const DEFAULT_ERROR_DURATION_MS = 6000;

class LogError {
    name!: string;
    message?: string;
    details!: object;

    constructor(public source: unknown) {
        this.name = String((source as { name: unknown })?.name ?? 'Unknown error');
        this.message = String((source as { message: unknown })?.message ?? '');
        this.details =
            source && typeof source === 'object'
                ? Object.fromEntries(
                      Object.entries(source).filter(
                          ([k, v]) => k !== 'name' && k !== 'message' && v
                      )
                  )
                : {};
    }
}

type Operations = 'create' | 'receive' | 'update' | 'delete';

@Injectable({ providedIn: 'root' })
export class LogService {
    constructor(private snackBar: MatSnackBar) {}

    success(message?: string): void;
    success(operation: Operations, objectName: string): void;
    success(messageOrOperation = 'Completed successfully', objectName?: string) {
        let message!: string;
        if (objectName)
            switch (messageOrOperation as Operations) {
                case 'create':
                    message = `${capitalize(objectName)} created successfully`;
                    break;
                case 'receive':
                    message = `${capitalize(objectName)} received successfully`;
                    break;
                case 'update':
                    message = `${capitalize(objectName)} updated successfully`;
                    break;
                case 'delete':
                    message = `${capitalize(objectName)} deleted successfully`;
                    break;
            }
        else message = messageOrOperation;
        this.notify(message);
    }

    error(error: unknown, message?: string): void;
    error(error: unknown, operation: Operations, objectName: string): void;
    error(error: unknown, messageOrOperation?: string, objectName?: string) {
        const logError = new LogError(error);
        let message!: string;
        if (objectName)
            switch (messageOrOperation as Operations) {
                case 'create':
                    message = `Error creating ${objectName}`;
                    break;
                case 'receive':
                    message = `Error retrieving ${objectName}`;
                    break;
                case 'update':
                    message = `Error updating ${objectName}`;
                    break;
                case 'delete':
                    message = `Error deleting ${objectName}`;
                    break;
            }
        else message = messageOrOperation || logError.message || logError.name;
        console.warn(
            [
                `Caught error: ${message}.`,
                logError.name && `Name: ${logError.name}.`,
                logError.message && `Message: ${logError.message}.`,
                Object.keys(logError.details).length && JSON.stringify(logError.details, null, 2),
            ]
                .filter(Boolean)
                .join('\n')
        );
        this.notify(message, DEFAULT_ERROR_DURATION_MS);
    }

    private notify(message: string, duration = DEFAULT_DURATION_MS) {
        return this.snackBar.open(message, 'OK', {
            duration,
        });
    }
}
