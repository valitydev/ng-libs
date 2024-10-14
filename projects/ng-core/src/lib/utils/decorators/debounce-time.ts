export function DebounceTime(ms: number = 500) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let timer: number | null = null;
        const method = descriptor.value;

        descriptor.value = function () {
            if (timer !== null) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(() => {
                method.apply(this, arguments);
                timer = null;
            }, ms);
        };
    };
}
