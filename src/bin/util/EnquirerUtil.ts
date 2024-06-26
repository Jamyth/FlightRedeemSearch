import * as enquirer from "enquirer";
// @ts-ignore -- no type
import NumeralInput from "enquirer/lib/prompts/numeral.js";
// @ts-ignore -- no type
import AutoComplete from "enquirer/lib/prompts/autocomplete.js";
import type { AutoComplete as AutoCompleteType } from "../types/AutoComplete.js";
import type { NumeralInput as NumeralInputType } from "../types/NumeralInput.js";

const { prompt } = enquirer.default;
const _AutoComplete = AutoComplete as typeof AutoCompleteType;
const _NumeralInput = NumeralInput as typeof NumeralInputType;

interface NumberOptions {
    min?: number;
    max?: number;
    initial?: number;
}

async function date<Optional extends boolean = false>(
    message: string,
    optional: Optional,
): Promise<Optional extends true ? Date | undefined : Date> {
    const placeholder = "MM/DD";
    const key = "date";
    const answer = await prompt({
        type: "input",
        name: key,
        message: `${message} (${placeholder})`,
        result: (value: string) => {
            if (!value) {
                return "";
            }
            const year = new Date().getFullYear();
            return `${year}/${value}`;
        },
        validate: (value: string) => {
            if (!value && optional) {
                return true;
            }

            if (/[0-9]{2}\/[0-9]{2}/.test(value)) {
                return true;
            }
            return "Date Format should be MM/DD";
        },
    });
    const value = (answer as any)[key];

    if (!value && optional) {
        return undefined as any;
    }
    return new Date(value);
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

async function multiple(message: string, choices: string[], initial?: string[]): Promise<string[]> {
    const key = "multiple";
    const answer = await prompt({
        type: "multiselect",
        name: key,
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
    date,
    multiple,
});
