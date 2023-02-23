import { DateUtil } from "./util/DateUtil";

export interface FlightPlanQuery {
    minDays: number;
    maxDays: number;
    departureDate: Date;
    arrivalDate: Date;
}

export class FlightPlanQueryBuilder {
    private query: FlightPlanQuery;

    constructor() {
        this.query = {
            minDays: 1,
            maxDays: 180,
            departureDate: DateUtil.today("day-start"),
            arrivalDate: DateUtil.daysAfterToday(180, "day-end"),
        };
    }

    withMinDays(minDays: number) {
        this.query.minDays = minDays;
        return this;
    }

    withMaxDays(maxDays: number) {
        this.query.maxDays = maxDays;
        return this;
    }

    withDepartureDate(departureDate: Date | undefined) {
        this.query.departureDate = departureDate ?? DateUtil.today("day-start");
        return this;
    }

    withArrivalDate(arrivalDate: Date | undefined) {
        this.query.arrivalDate = arrivalDate ?? DateUtil.daysAfterToday(180, "day-end");
        return this;
    }

    build() {
        return this.query;
    }
}
