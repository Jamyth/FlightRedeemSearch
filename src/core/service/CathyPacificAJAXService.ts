import { ajax } from "./network";
import type {
    AvailabilityAJAXResponse,
    GetAirportAJAXResponse,
    CabinClass,
    GetFlightCabinInfoAJAXResponse,
} from "../type/api";

export class CathyPacificAJAXService {
    static getAirportOrigin(): Promise<GetAirportAJAXResponse> {
        return ajax("GET", "https://api.cathaypacific.com/redibe/airport/origin/en_HK/", {}, null);
    }

    static getAirportDestination(airportCode: string): Promise<GetAirportAJAXResponse> {
        return ajax(
            "GET",
            "https://api.cathaypacific.com/redibe/airport/destination/:airportCode/en_HK/",
            { airportCode },
            null,
        );
    }

    static getFlightCabinInfo(from: string, to: string): Promise<GetFlightCabinInfoAJAXResponse> {
        return ajax(
            "GET",
            `https://api.cathaypacific.com/afr/searchpanel/searchoptions/en.${from}.${to}.ow.std.CX.json`,
            {},
            null,
        );
    }

    static availability(
        from: string,
        to: string,
        cabinClass: CabinClass,
        passengers: number,
        departOn: string,
        arriveOn: string,
    ): Promise<AvailabilityAJAXResponse> {
        return ajax(
            "GET",
            `https://api.cathaypacific.com/afr/search/availability/en.${from}.${to}.${cabinClass}.CX.${passengers}.${departOn}.${arriveOn}.json`,
            {},
            null,
        );
    }
}
