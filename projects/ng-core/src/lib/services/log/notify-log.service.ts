import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { capitalize } from 'lodash-es';

import { DEFAULT_ERROR_NAME, LogError } from './log-error';
import { Operation } from './types/operation';

const DEFAULT_DURATION_MS = 3000;
const DEFAULT_ERROR_DURATION_MS = 10000;

@Injectable({ providedIn: 'root' })
export class NotifyLogService {
    constructor(private snackBar: MatSnackBar) {}

    success = (message: string = 'Completed successfully'): void => {
        this.notify(message);
    };

    error = (errors: unknown | unknown[], message?: string): void => {
        const logErrors = (Array.isArray(errors) ? errors : [errors]).map((e) => new LogError(e));
        message = message || (logErrors.length === 1 ? logErrors[0].message : DEFAULT_ERROR_NAME);
        console.warn(
            `Caught error: ${message}.`,
            logErrors.map((e) => e.getLogMessage())
        );
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
