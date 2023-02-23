import { AvailabilityAJAXResponse$Availability as Availability } from "../type/api";

export interface FlightInfo {
    departure: Availability;
    arrival: Availability;
    days: number;
}

export interface FlightSelectionStrategy {
    selectFlights(departureData: Record<string, string>, arrivalData: Record<string, string>): FlightInfo[];
}
