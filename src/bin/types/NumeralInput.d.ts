export interface Option {
    name: string;
    message: string;
    initial?: number;
}

export declare class NumeralInput {
    constructor(option: Option);

    run(): Promise<number>;
}
