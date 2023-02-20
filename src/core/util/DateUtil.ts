import { DateUtil as IamythDateUtil, ArrayUtil } from "@iamyth/util";

function getDateOfTheMonth(year: number, month: number) {
    if (month > 12 || month <= 0) {
        throw new Error("[DateUtil]: getDateOfTheMonth(): month should be in between 1 - 12");
    }

    return new Date(year, month, 0).getDate();
}

function chunkDateString(dateString: string): [number, number, number] {
    const shape = [4, 2, 2];
    return ArrayUtil.chunk(dateString.split(""), shape).map((_) => parseInt(_.join(""))) as [number, number, number];
}

export const DateUtil = Object.freeze({
    ...IamythDateUtil,
    getDateOfTheMonth,
    chunkDateString,
});
