import { DateUtil } from "./util/DateUtil";
import { AvailabilityAJAXResponse$Availability as Availability, AvailabilityTypeView } from "./type/api";

export interface FlightInfo {
    departure: Availability;
    arrival: Availability;
    days: number;
}

// TODO/Jamyth Apply design pattern
/**
 * Feature Request
 * - start/end date
 * - specify weekday
 */
export class FlightPlanAnalyzer {
    private minDay: number;
    private maxDay: number;
    private startDate: Date;
    private endDate: Date;
    private departureData: Record<string, string> | null;
    private arrivalData: Record<string, string> | null;

    constructor() {
        this.minDay = 1;
        this.maxDay = 180;
        this.startDate = DateUtil.today("day-start");
        this.endDate = DateUtil.daysAfterToday(180, "day-start");
        this.departureData = null;
        this.arrivalData = null;
    }

    setMinDay(minDay: number) {
        this.minDay = minDay;
    }

    setMaxDay(maxDay: number) {
        this.maxDay = maxDay;
    }

    setStartDate(date: Date) {
        this.startDate = date;
    }

    setEndDate(date: Date) {
        this.endDate = date;
    }

    setDepartureData(data: Record<string, string>) {
        this.departureData = data;
    }

    setArrivalData(data: Record<string, string>) {
        this.arrivalData = data;
    }

    analyze() {
        if (!this.departureData || !this.arrivalData) {
            throw new Error("Missing Required Data");
        }

        const departureList = Object.keys(this.departureData);
        const arrivalList = new Set(Object.keys(this.arrivalData));

        const result: FlightInfo[] = [];

        for (const start of departureList) {
            const [year, month, day] = DateUtil.chunkDateString(start);
            const daysInCurrentMonth = DateUtil.getDateOfTheMonth(year, month);
            if (DateUtil.compare(new Date(year, month - 1, day), this.startDate) === "less") {
                continue;
            }
            for (let i = this.minDay; i <= this.maxDay; i++) {
                const shouldNextMonth = day + i > daysInCurrentMonth;
                const shouldNextYear = month + 1 > 12;
                const dateSum = day + i;
                // When i = 31, & date is 30, remainder would be 1 if daysInCurrentMonth is 30
                // simply - daysInCurrentMonth will get the exact date
                const newDay =
                    dateSum / daysInCurrentMonth > 1 ? dateSum - daysInCurrentMonth : (day + i) % daysInCurrentMonth;
                const newMonth = shouldNextMonth ? (month + 1) % 12 : month;
                const newYear = shouldNextYear ? year + 1 : year;
                const key = `${newYear}${DateUtil.zeroPad(newMonth)}${DateUtil.zeroPad(newDay)}`;
                const endDate = new Date(DateUtil.chunkDateString(key).join("/"));
                const hasFlight = arrivalList.has(key);

                if (hasFlight && DateUtil.compare(endDate, this.endDate) !== "greater") {
                    result.push({
                        departure: {
                            date: DateUtil.chunkDateString(start).join("/"),
                            availability: this.departureData[start] as AvailabilityTypeView,
                        },
                        arrival: {
                            date: DateUtil.chunkDateString(key).join("/"),
                            availability: this.arrivalData[key] as AvailabilityTypeView,
                        },
                        days: i,
                    });
                }
            }
        }
        return result.sort((a, b) => a.days - b.days);
    }
}
