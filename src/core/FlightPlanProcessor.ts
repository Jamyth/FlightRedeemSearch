import { AvailabilityAJAXResponse$Availability as Availability, AvailabilityTypeView } from "./type/api";
import { DateString } from "./util/DateString";

interface ProcessedFlightAvailability extends Omit<Availability, "date"> {
    date: DateString;
}

export interface FlightInfo {
    departure: ProcessedFlightAvailability;
    arrival: ProcessedFlightAvailability;
    days: number;
}

interface FlightPlanProcessorConstructorParam {
    departureFlightData: Record<string, string>;
    arrivalFlightData: Record<string, string>;
}

export class FlightPlanProcessor {
    private departureFlightData: Record<string, string>;
    private arrivalFlightData: Record<string, string>;

    constructor({ departureFlightData, arrivalFlightData }: FlightPlanProcessorConstructorParam) {
        this.departureFlightData = departureFlightData;
        this.arrivalFlightData = arrivalFlightData;
    }

    process(): FlightInfo[] {
        const { departureDateSet, arrivalDateSet } = this.extractDepartureAndArrivalDateSet();

        const flightInfos: FlightInfo[] = [];

        for (const departureDataKey of departureDateSet) {
            const departureDateString = new DateString(departureDataKey);

            for (let period = 1; period <= 180; period++) {
                const arrivalDateString = departureDateString.getNextDateStringByPeriod(period);
                const arrivalDataKey = arrivalDateString.toKey();

                if (!arrivalDateSet.has(arrivalDataKey)) {
                    continue;
                }

                const flightInfo: FlightInfo = {
                    departure: {
                        date: departureDateString,
                        availability: this.departureFlightData[departureDataKey] as AvailabilityTypeView,
                    },
                    arrival: {
                        date: arrivalDateString,
                        availability: this.arrivalFlightData[arrivalDataKey] as AvailabilityTypeView,
                    },
                    days: period,
                };

                flightInfos.push(flightInfo);
            }
        }

        return flightInfos;
    }

    private extractDepartureAndArrivalDateSet(): {
        departureDateSet: Set<string>;
        arrivalDateSet: Set<string>;
    } {
        const departureDateList = Object.keys(this.departureFlightData);
        const arrivalDateList = Object.keys(this.arrivalFlightData);
        const departureDateSet = new Set(departureDateList);
        const arrivalDateSet = new Set(arrivalDateList);
        return { departureDateSet, arrivalDateSet };
    }
}
