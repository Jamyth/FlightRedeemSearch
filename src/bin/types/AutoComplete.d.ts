export interface AutoCompleteConfig {
    name: string;
    message: string;
    choices: string[];
    limit?: number;
    initial?: number;
    multiple?: boolean;
}

export declare class AutoComplete {
    constructor(config: AutoCompleteConfig);

    async run(): Promise<string>;
}
