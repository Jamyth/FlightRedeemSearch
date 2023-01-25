import { prompt } from "enquirer";
// @ts-ignore
import NumeralInput from "enquirer/lib/prompts/numeral";
// @ts-ignore
import AutoComplete from "enquirer/lib/prompts/autocomplete";
import type { AutoComplete as AutoCompleteType } from "../types/AutoComplete";
import type { NumeralInput as NumeralInputType } from "../types/NumeralInput";

const _AutoComplete = AutoComplete as typeof AutoCompleteType;
const _NumeralInput = NumeralInput as typeof NumeralInputType;

function autocomplete(message: string, choices: string[]) {
    return new _AutoComplete({
        name: "autocomplete",
        limit: 10,
        message,
        choices,
    }).run();
}

function number(message: string) {
    return new _NumeralInput({ name: "numeral", message }).run();
}

async function select(message: string, choices: string[]): Promise<string> {
    const key = "select";
    const answer = await prompt({
        type: "select",
        name: "select",
        message,
        choices,
    });

    return (answer as any)[key];
}

export const EnquirerUtil = Object.freeze({
    autocomplete,
    number,
    select,
});
