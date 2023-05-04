import { Observable } from 'rxjs';

export type Column<T> =
    | {
          field: string;
          header?: string | Observable<string>;
          hide?: boolean;
          formatter?: (data: T) => string;
      }
    | string;
