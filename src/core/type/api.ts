export interface AvailabilityAJAXResponse {
    availabilities: {
        pt1: [];
        pt2: [];
        std: AvailabilityAJAXResponse$Availability[];
        updatedTime: string;
    };
}

export interface AvailabilityAJAXResponse$Availability {
    availability: AvailabilityTypeView;
    date: string;
}

export interface GetAirportAJAXResponse {
    airports: GetAirportAJAXResponse$Airport[];
    errors: any[];
}

export interface GetAirportAJAXResponse$Airport {
    airportCode: string;
    airportFullName: string;
    airportShortName: string;
    cityCode: string;
    cityName: string;
    countryCode: string;
    countryName: string;
    desktopBanner: string;
    name: string;
    shortName: string;
    tabletBanner: string;
    thumbnail: string;
}

export interface GetFlightCabinInfoAJAXResponse {
    milesRequired: Record<CabinClass, number>;
    searchStartDate: string;
    searchEndDate: string;
}

export enum AvailabilityTypeView {
    NA = "NA",
    L = "L",
    H = "H",
}

export enum CabinClass {
    ECONOMY = "eco",
    PREMIUM_ECONOMY = "pey",
    BUSINESS = "bus",
    FIRST = "fir",
}
