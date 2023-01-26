import { PromiseUtil } from "@iamyth/util";

export function Retry(time: number = 3): MethodDecorator {
    let retried = 0;

    return (key, target, descriptor) => {
        const originalFn = descriptor.value! as unknown as Function;

        descriptor.value = async function (...args: any[]) {
            // @ts-expect-error
            const bounded = originalFn.bind(this, ...args);

            while (true) {
                try {
                    const returned = await bounded();
                    return returned;
                } catch (error) {
                    retried++;
                    if (retried > 3) {
                        throw error;
                    } else {
                        console.info("Encountered error, retrying");
                        await PromiseUtil.sleep(1000);
                    }
                }
            }
        } as any;

        return descriptor;
    };
}
