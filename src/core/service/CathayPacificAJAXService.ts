import { ajax } from "./network.js";
import type {
    AvailabilityAJAXResponse,
    GetAirportAJAXResponse,
    CabinClass,
    GetFlightCabinInfoAJAXResponse,
} from "../type/api.js";

export class CathayPacificAJAXService {
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

    static async getFlightCabinInfo(from: string, to: string): Promise<GetFlightCabinInfoAJAXResponse> {
        const data = await ajax(
            "GET",
            `https://api.cathaypacific.com/afr/searchpanel/searchoptions/en.${from}.${to}.ow.std.CX.json`,
            {},
            null,
        );

        try {
            return JSON.parse(data as any);
        } catch (error) {
            return data as GetFlightCabinInfoAJAXResponse;
        }
    }

    static async availability(
        from: string,
        to: string,
        cabinClass: CabinClass,
        passengers: number,
        departOn: string,
        arriveOn: string,
    ): Promise<AvailabilityAJAXResponse> {
        const data = await ajax(
            "GET",
            `https://api.cathaypacific.com/afr/search/availability/en.${from}.${to}.${cabinClass}.CX.${passengers}.${departOn}.${arriveOn}.json`,
            {},
            null,
        );

        try {
            return JSON.parse(data as any);
        } catch (error) {
            return data as AvailabilityAJAXResponse;
        }
    }
}
