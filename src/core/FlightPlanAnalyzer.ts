import type { FlightPlanQuery } from "./FlightPlanQueryBuilder.js";
import { FlightPlanQueryBuilder } from "./FlightPlanQueryBuilder.js";
import type { FlightInfo } from "./FlightPlanProcessor.js";
import { FlightPlanProcessor } from "./FlightPlanProcessor.js";
import { DateUtil } from "./util/DateUtil.js";

export class FlightPlanAnalyzer {
    private query: FlightPlanQuery;

    constructor() {
        this.query = new FlightPlanQueryBuilder().build();
    }

    setQuery(query: FlightPlanQuery) {
        this.query = query;
    }

    analyze(departureFlightData: Record<string, string>, arrivalFlightData: Record<string, string>) {
        const flightInfos = new FlightPlanProcessor({ departureFlightData, arrivalFlightData }).process();
        return flightInfos.filter((info) => {
            return (
                this.withMinMaxDays(info) &&
                this.withTargetDepartureAndArrivalDate(info) &&
                this.withTargetDepartureWeekday(info) &&
                this.withTargetArrivalWeekday(info)
            );
        });
    }

    private withMinMaxDays(flightInfo: FlightInfo) {
        const { minDays, maxDays } = this.query;
        const { days } = flightInfo;
        return days > minDays && days < maxDays;
    }

    private withTargetDepartureAndArrivalDate(flightInfo: FlightInfo) {
        const { departureDate, arrivalDate } = this.query;
        const { departure, arrival } = flightInfo;
        const isOnOrAfterTargetDepartureDate = DateUtil.compare(departure.date.toDate(), departureDate) !== "before";
        const isOnOrBeforeTargetArrivalDate = DateUtil.compare(arrival.date.toDate(), arrivalDate) !== "after";
        return isOnOrAfterTargetDepartureDate && isOnOrBeforeTargetArrivalDate;
    }

    private withTargetDepartureWeekday(flightInfo: FlightInfo) {
        const { preferDepartureWeekday } = this.query;

        if (!preferDepartureWeekday.length) {
            return true;
        }

        const weekday = DateUtil.getWeekday(flightInfo.departure.date.toDate());
        return preferDepartureWeekday.includes(weekday);
    }

    private withTargetArrivalWeekday(flightInfo: FlightInfo) {
        const { preferArrivalWeekday } = this.query;

        if (!preferArrivalWeekday.length) {
            return true;
        }

        const weekday = DateUtil.getWeekday(flightInfo.arrival.date.toDate());
        return preferArrivalWeekday.includes(weekday);
    }
}
