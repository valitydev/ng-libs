import * as shortUuidLib from 'short-uuid';

export function shortUuid() {
    return shortUuidLib().generate();
}
