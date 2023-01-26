import { prompt } from "enquirer";
// @ts-ignore
import NumeralInput from "enquirer/lib/prompts/numeral";
// @ts-ignore
import AutoComplete from "enquirer/lib/prompts/autocomplete";
import type { AutoComplete as AutoCompleteType } from "../types/AutoComplete";
import type { NumeralInput as NumeralInputType } from "../types/NumeralInput";

const _AutoComplete = AutoComplete as typeof AutoCompleteType;
const _NumeralInput = NumeralInput as typeof NumeralInputType;

interface NumberOptions {
    min?: number;
    max?: number;
    initial?: number;
}

function autocomplete(message: string, choices: string[], initial?: number) {
    return new _AutoComplete({
        name: "autocomplete",
        limit: 10,
        message,
        choices,
        initial,
    }).run();
}

async function number(message: string, option?: NumberOptions): Promise<number> {
    const { initial, min, max = Infinity } = option || {};
    const create = () => {
        return new _NumeralInput({ name: "numeral", message, initial }).run();
    };
    let answer = await create();

    if (min === undefined) {
        return answer;
    }

    while (answer < min || answer > max) {
        if (answer < min) {
            console.info(`Your answer cannot be less than ${min}`);
        } else {
            console.info(`Your answer cannot be larger than ${max}`);
        }
        answer = await create();
    }
    return answer;
}

async function select(message: string, choices: string[], initial?: string): Promise<string> {
    const key = "select";
    const answer = await prompt({
        type: "select",
        name: "select",
        message,
        choices,
        initial: initial as any,
    });

    return (answer as any)[key];
}

export const EnquirerUtil = Object.freeze({
    autocomplete,
    number,
    select,
});
