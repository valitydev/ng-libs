import * as short from 'short-uuid';

export function shortUuid() {
    return short().generate();
}
