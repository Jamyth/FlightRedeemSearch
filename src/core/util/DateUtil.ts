import { DateUtil as IamythDateUtil, ArrayUtil } from "@iamyth/util";

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

function getDateOfTheMonth(year: number, month: number) {
    if (month > 12 || month <= 0) {
        throw new Error("[DateUtil]: getDateOfTheMonth(): month should be in between 1 - 12");
    }

    return new Date(year, month, 0).getDate();
}

function chunkDateString(dateString: string): [number, number, number] {
    const shape = [4, 2, 2];
    return ArrayUtil.chunk(dateString.split(""), shape).map((_: string[]) => parseInt(_.join(""), 10)) as [
        number,
        number,
        number,
    ];
}

function getDateKey(date: Date = new Date()) {
    const year = date.getFullYear();
    const month = zeroPad(date.getMonth() + 1);
    const day = zeroPad(date.getDate());

    return year + month + day;
}

function zeroPad(value: number) {
    return value.toString().padStart(2, "0");
}

function compare(dateA: Date, dateB: Date): "after" | "before" | "same" {
    const yearA = dateA.getFullYear();
    const yearB = dateB.getFullYear();
    const monthA = dateA.getMonth();
    const monthB = dateB.getMonth();
    const dayA = dateA.getDate();
    const dayB = dateB.getDate();

    if (yearA > yearB) {
        return "after";
    } else if (yearB > yearA) {
        return "before";
    }

    if (monthA > monthB) {
        return "after";
    } else if (monthB > monthA) {
        return "before";
    }

    if (dayA > dayB) {
        return "after";
    } else if (dayB > dayA) {
        return "before";
    }

    return "same";
}

function getWeekday(date: Date): Weekday {
    const day = date.getDay();

    switch (day) {
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 0:
            return "Sunday";
        default:
            throw new Error(`[DateUtil]: getWeekDay: invalid weekday: reading ${day}`);
    }
}

export const DateUtil = Object.freeze({
    ...IamythDateUtil,
    getDateOfTheMonth,
    chunkDateString,
    getDateKey,
    zeroPad,
    compare,
    getWeekday,
});
