import { Observable } from 'rxjs';

// eslint-disable-next-line unused-imports/no-unused-vars
export type Column<T> =
    | {
          field: string;
          header?: string | Observable<string>;
          hide?: boolean;
      }
    | string;
