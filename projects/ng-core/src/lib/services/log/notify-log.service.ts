import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { capitalize } from 'lodash-es';

import { LogError } from './log-error';
import { Operation } from './types/operation';

const DEFAULT_DURATION_MS = 3000;
const DEFAULT_ERROR_DURATION_MS = 10000;

@Injectable({ providedIn: 'root' })
export class NotifyLogService {
    constructor(private snackBar: MatSnackBar) {}

    success = (message: string = 'Completed successfully'): void => {
        this.notify(message);
    };

    error = (error: unknown, message?: string): void => {
        const logError = new LogError(error);
        message = message || logError.message;
        console.warn(logError.getLogMessage(message));
        this.notify(message, DEFAULT_ERROR_DURATION_MS);
    };

    createErrorOperation(operation: Operation, objectName: string) {
        return (err: unknown) => this.errorOperation(err, operation, objectName);
    }

    successOperation(operation: Operation, objectName: string): void {
        let message!: string;
        switch (operation) {
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
        this.success(message);
    }

    errorOperation(error: unknown, operation: Operation, objectName: string) {
        let message!: string;
        switch (operation) {
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
        this.error(error, message);
    }

    private notify(message: string, duration = DEFAULT_DURATION_MS) {
        return this.snackBar.open(message, 'OK', {
            duration,
        });
    }
}
