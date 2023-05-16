import { catchError, EMPTY, MonoTypeOperatorFunction } from 'rxjs';

export function passError<T>(handler: (err: unknown) => void): MonoTypeOperatorFunction<T> {
    return (source) =>
        source.pipe(
            catchError((err) => {
                handler(err);
                return EMPTY;
            })
        );
}
