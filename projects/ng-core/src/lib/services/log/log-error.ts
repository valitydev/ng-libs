export class LogError {
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
