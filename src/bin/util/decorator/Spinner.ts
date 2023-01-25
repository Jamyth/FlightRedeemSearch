import { SpinnerUtil } from "../SpinnerUtil";

export function Spinner(message: string): MethodDecorator {
    return (key, target, descriptor) => {
        const originalFn = descriptor.value! as unknown as Function;

        descriptor.value = async function (...args: any[]) {
            // @ts-expect-error
            const boundFn = originalFn.bind(this, ...args);

            const spinner = SpinnerUtil.create(message, message);
            try {
                await boundFn();
                spinner();
            } catch (error) {
                spinner(false);
                throw error;
            }
        } as any;

        return descriptor;
    };
}
