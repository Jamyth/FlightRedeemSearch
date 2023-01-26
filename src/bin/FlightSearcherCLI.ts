import { CabinClass, FlightSearcher, CabinClassTranslationMap, FlightPlanAnalyzer, FlightInfo } from "../core";
import { PromiseUtil } from "@iamyth/util";
import { Spinner } from "./util/decorator/Spinner";
import { EnquirerUtil } from "./util/EnquirerUtil";

export class FlightSearcherCLI {
    private flightSearcher: FlightSearcher | null;
    private flightAnalyzer: FlightPlanAnalyzer;
    private enableAdvanceSearch: boolean;

    private get fs() {
        if (!this.flightSearcher) {
            throw new Error("Flight Searcher is not initialized");
        }
        return this.flightSearcher;
    }

    constructor() {
        this.flightSearcher = null;
        this.flightAnalyzer = new FlightPlanAnalyzer();
        this.enableAdvanceSearch = false;
    }

    async run() {
        try {
            await this.initFlightSearcher();
            await this.promptOrigin();
            await this.fetchDestinations();
            await this.promptDestination();
            await this.promptCabinClass();
            await this.promptPassenger();
            await this.promptAdvanceSearch();
            if (this.enableAdvanceSearch) {
                await this.promptDays();
            }
            await this.searchFlights();
            this.analyzeFlights();
        } catch (error) {
            console.info("Terminating...");
            console.info(error);
            process.exit();
        }
    }

    private async promptOrigin() {
        const airports = this.fs.airportList();
        const choices = airports.map((airport) => `${airport.countryName} ${airport.shortName}`);
        const originRaw = await EnquirerUtil.autocomplete("Please select departing airport", choices);
        const origin = airports.find((_) => originRaw.endsWith(_.shortName));
        this.fs.setOrigin(origin!);
        this.blankLn();
    }

    private async promptDestination() {
        const airports = this.fs.destinationList();
        const choices = airports.map((airport) => `${airport.countryName} ${airport.shortName}`);
        const destinationRaw = await EnquirerUtil.autocomplete("Please select departing airport", choices);
        const destination = airports.find((_) => destinationRaw.endsWith(_.shortName));
        this.fs.setDestination(destination!);
        this.blankLn();
    }

    private async promptCabinClass() {
        const choices = Object.keys(CabinClassTranslationMap);
        const cabinClassKey = await EnquirerUtil.select("Please Select Cabin Class", choices);
        const cabinClass = CabinClassTranslationMap[cabinClassKey] || CabinClass.ECONOMY;
        this.fs.setCabinClass(cabinClass);
        this.blankLn();
    }

    private async promptPassenger() {
        const passengers = await EnquirerUtil.number("How many passengers ?");
        this.fs.setPassengers(passengers);
        this.blankLn();
    }

    private async promptAdvanceSearch() {
        const enableAdvanceSearch = await EnquirerUtil.select("Enable Advance Search ?", ["Yes", "No"]);
        this.enableAdvanceSearch = enableAdvanceSearch === "Yes";
    }

    private async promptDays() {
        const minDay = await EnquirerUtil.number("How many days do you want at least ?");
        const maxDay = await EnquirerUtil.number("How many days do you want at most ?");

        if (minDay <= 0 || maxDay < minDay) {
            throw new Error("Please input valid value");
        }

        this.flightAnalyzer.setMinDay(minDay);
        this.flightAnalyzer.setMaxDay(maxDay);
    }

    private analyzeFlights() {
        const info = this.fs.info();
        const flights = this.flightAnalyzer.analyze();

        console.info("------- Flight Info -------");
        console.info("FROM         : ", info.from);
        console.info("TO           : ", info.to);
        console.info("CABIN CLASS  : ", info.cabinClass);
        console.info("PASSENGERS   : ", info.passengers);
        console.info("Flights Found: ", flights.length);
        this.blankLn();
        flights.forEach((flight) => this.formatFlight(flight));
    }

    @Spinner("Searching Available Flights...")
    private async searchFlights() {
        const [flights] = await Promise.all([this.fs.getFlightAvailability(), PromiseUtil.sleep(1000)]);
        if (!flights) {
            throw new Error("Flights not found...");
        }
        this.flightAnalyzer.setDepartureData(flights.departure);
        this.flightAnalyzer.setArrivalData(flights.arrival);
    }

    @Spinner("Retrieving Destination Airports...")
    private async fetchDestinations() {
        await this.fs.getDestinations();
    }

    @Spinner("Initializing Flight Searcher...")
    private async initFlightSearcher() {
        const fs = new FlightSearcher();
        await fs.init();
        this.flightSearcher = fs;
    }

    private blankLn() {
        console.info();
    }

    private formatFlight(flight: FlightInfo) {
        console.info("DEPART ON    : ", `${flight.departure.date} (${flight.departure.availability})`);
        console.info("RETURN ON    : ", `${flight.arrival.date} (${flight.arrival.availability})`);
        console.info("DAYS         : ", `${flight.days} (d)`);
        this.blankLn();
    }
}
