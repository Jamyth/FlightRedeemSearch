import { ArrayUtil, DateUtil } from "@iamyth/util";
import { TranslateUtil } from "./util/TranslateUtil";
import { CathyPacificAJAXService } from "./service/CathyPacificAJAXService";
import {
    AvailabilityTypeView,
    CabinClass,
    GetAirportAJAXResponse$Airport as Airport,
    AvailabilityAJAXResponse$Availability as FlightAvailability,
} from "./type/api";
import { Retry } from "./util/decorators/Retry";

interface FlightSearcherInfo {
    from: string;
    to: string;
    fromCode: string;
    toCode: string;
    cabinClass: string;
    passengers: number;
    milesRequired: Record<CabinClass, number | string>;
}

export class FlightSearcher {
    private airports: Airport[];
    private destinations: Airport[];
    private origin: Airport | null;
    private destination: Airport | null;
    private cabinClass: CabinClass | null;
    private passengers: number;
    private milesRequired: Record<CabinClass, number> | null;

    constructor() {
        this.airports = [];
        this.destinations = [];
        this.origin = null;
        this.destination = null;
        this.cabinClass = null;
        this.passengers = 0;
        this.milesRequired = null;
    }

    async init() {
        try {
            await this.getAirports();
        } catch (error) {
            console.error("[FlightSearcher]: Error while initializing class");
        }
    }

    airportList() {
        return this.airports;
    }

    destinationList() {
        return this.destinations;
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
            milesRequired: this.milesRequired || {
                [CabinClass.FIRST]: "N/A",
                [CabinClass.BUSINESS]: "N/A",
                [CabinClass.PREMIUM_ECONOMY]: "N/A",
                [CabinClass.ECONOMY]: "N/A",
            },
        };
    }

    @Retry(3)
    async getDestinations() {
        if (!this.origin) {
            return;
        }
        const code = this.origin.airportCode;
        const data = await CathyPacificAJAXService.getAirportDestination(code);
        this.destinations = data.airports;
    }

    @Retry(3)
    async getFlightCabinInfo() {
        if (!this.origin || !this.destination) {
            return;
        }
        const data = await CathyPacificAJAXService.getFlightCabinInfo(
            this.origin.airportCode,
            this.destination.airportCode,
        );
        this.milesRequired = data.milesRequired;
    }

    @Retry(3)
    async getFlightAvailability() {
        if (![this.cabinClass, this.passengers, this.origin, this.destination].every(Boolean)) {
            return null;
        }

        const from = this.origin!.airportCode;
        const to = this.destination!.airportCode;
        const cabinClass = this.cabinClass!;
        const passengers = this.passengers;
        const departOn = this.parseDate(DateUtil.today("day-start"));
        const arriveOn = this.parseDate(DateUtil.daysAfterToday(180, "day-end"));
        const departData = await CathyPacificAJAXService.availability(
            from,
            to,
            cabinClass,
            passengers,
            departOn,
            arriveOn,
        );
        const arrivalData = await CathyPacificAJAXService.availability(
            to,
            from,
            cabinClass,
            passengers,
            departOn,
            arriveOn,
        );

        const departureFlights = departData?.availabilities?.std?.filter(
            (_) => _.availability !== AvailabilityTypeView.NA,
        );
        const arrivalFlights = arrivalData?.availabilities?.std?.filter(
            (_) => _.availability !== AvailabilityTypeView.NA,
        );

        const mapper = (item: FlightAvailability): [string, AvailabilityTypeView] => {
            return [item.date, item.availability];
        };

        return {
            departure: ArrayUtil.toObject(departureFlights, mapper),
            arrival: ArrayUtil.toObject(arrivalFlights, mapper),
        };
    }

    @Retry(3)
    private async getAirports() {
        const data = await CathyPacificAJAXService.getAirportOrigin();
        this.airports = data.airports;
    }

    private parseDate(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}${month}${day}`;
    }
}
