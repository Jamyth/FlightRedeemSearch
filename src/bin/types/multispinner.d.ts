declare module "multispinner" {
    interface MultiSpinnerOptions {}

    class MultiSpinner {
        constructor(tasks: string[] | Record<string, string>, options?: MultiSpinnerOptions);
        start(): void;
        success(spinner: string): void;
        error(spinner: string): void;
    }
    export default MultiSpinner;
}
