import { DateUtil } from "./DateUtil";

export class DateString {
    constructor(private dateString: string) {}

    getNextDateStringByPeriod(period: number): DateString {
        const [departureYear, departureMonth, departureDay] = DateUtil.chunkDateString(this.dateString);
        const daysInDepartureMonth = DateUtil.getDateOfTheMonth(departureYear, departureMonth);

        const sumOfDepartureDayAndPeriod = departureDay + period;
        const nextMonthFromDeparture = departureMonth + 1;
        const nextYearFromDeparture = departureYear + 1;

        const isArrivalDateNextMonth = sumOfDepartureDayAndPeriod > daysInDepartureMonth;
        const isArrivalDateNextYear = nextMonthFromDeparture > 12;

        const arrivalYear = isArrivalDateNextYear ? nextYearFromDeparture : departureYear;
        const arrivalMonth = isArrivalDateNextMonth ? nextMonthFromDeparture % 12 : departureMonth;
        const arrivalDay =
            sumOfDepartureDayAndPeriod / daysInDepartureMonth > 1
                ? sumOfDepartureDayAndPeriod - daysInDepartureMonth
                : sumOfDepartureDayAndPeriod % daysInDepartureMonth;
        const arrivalDateString = [arrivalYear, DateUtil.zeroPad(arrivalMonth), DateUtil.zeroPad(arrivalDay)].join("");
        return new DateString(arrivalDateString);
    }

    toDate(): Date {
        return new Date(this.toString());
    }

    toString() {
        return DateUtil.chunkDateString(this.dateString).join("/");
    }

    toKey(): string {
        return this.dateString;
    }
}
