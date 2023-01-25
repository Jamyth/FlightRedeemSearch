export interface Option {
    name: string;
    message: string;
}

export declare class NumeralInput {
    constructor(option: Option);

    run(): Promise<number>;
}
