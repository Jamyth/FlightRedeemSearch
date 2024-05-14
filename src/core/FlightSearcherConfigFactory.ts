import { TranslateUtil } from "./util/TranslateUtil.js";
import type { AvailabilityTypeView, CabinClass, GetAirportAJAXResponse$Airport as Airport } from "./type/api.js";

interface FlightSearcherInfo {
    from: string;
    to: string;
    fromCode: string;
    toCode: string;
    cabinClass: string;
    passengers: number;
}

type FlightData = {
    [key: string]: AvailabilityTypeView;
};

export interface FlightAvailability {
    departure: FlightData;
    arrival: FlightData;
}

export class FlightSearcherConfigFactory {
    private origin: Airport | null;
    private destination: Airport | null;
    private cabinClass: CabinClass | null;
    private passengers: number;

    constructor() {
        this.origin = null;
        this.destination = null;
        this.cabinClass = null;
        this.passengers = 0;
    }

    setOrigin(airport: Airport) {
        this.origin = airport;
    }

    setDestination(airport: Airport) {
        this.destination = airport;
    }

    setCabinClass(cabinClass: CabinClass) {
        this.cabinClass = cabinClass;
    }

    setPassengers(passengers: number) {
        this.passengers = passengers;
    }

    info(): FlightSearcherInfo {
        return {
            from: this.origin?.shortName || "N/A",
            to: this.destination?.shortName || "N/A",
            fromCode: this.origin?.airportCode || "N/A",
            toCode: this.destination?.airportCode || "N/A",
            cabinClass: this.cabinClass ? TranslateUtil.cabinClass(this.cabinClass) : "N/A",
            passengers: this.passengers || 0,
        };
    }
}
