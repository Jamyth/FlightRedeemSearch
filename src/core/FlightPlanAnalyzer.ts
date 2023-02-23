import { FlightPlanProcessor, FlightInfo } from "./FlightPlanProcessor";
import { FlightPlanQuery } from "./FlightPlanQueryBuilder";
import { DateUtil } from "./util/DateUtil";

export class FlightPlanAnalyzer {
    constructor(private query: FlightPlanQuery) {}

    analyze(departureFlightData: Record<string, string>, arrivalFlightData: Record<string, string>) {
        const flightInfos = new FlightPlanProcessor({ departureFlightData, arrivalFlightData }).process();
        return flightInfos.filter((info) => {
            return this.withMinMaxDays(info) && this.withTargetDepartureAndArrivalDate(info);
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
        const isOnOrAfterTargetDepartureDate = DateUtil.compare(new Date(departure.date), departureDate) !== "before";
        const isOnOrBeforeTargetArrivalDate = DateUtil.compare(new Date(arrival.date), arrivalDate) !== "after";
        return isOnOrAfterTargetDepartureDate && isOnOrBeforeTargetArrivalDate;
    }
}
