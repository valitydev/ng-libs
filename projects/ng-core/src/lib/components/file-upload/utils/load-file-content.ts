import { Observable } from 'rxjs';

export function loadFileContent(file: File, encoding = 'utf-8'): Observable<string> {
    return new Observable((subscriber) => {
        if (!file) {
            return file;
        }
        const read = new FileReader();
        read.readAsText(file, encoding);
        read.onloadend = function () {
            if (read.error) {
                return subscriber.error(read.error);
            } else {
                subscriber.next((read.result as string) || '');
            }
            subscriber.complete();
        };
    });
}
