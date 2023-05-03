import { Observable } from 'rxjs';

export type Column<ObjectType> =
    | {
          field: string;
          header?: string | Observable<string>;
          hide?: boolean;
      }
    | string;
