// @ts-ignore
import MultiSpinner from "multispinner";

function create(key: string, message: string) {
    const spinner = new MultiSpinner({ [key]: message }, { indent: 0 });

    return (success: boolean = true) => {
        if (success) {
            spinner.success(key);
        } else {
            spinner.error(key);
        }
    };
}

export const SpinnerUtil = Object.freeze({
    create,
});
