import {
    CabinClass,
    FlightSearcher,
    CabinClassTranslationMap,
    FlightPlanAnalyzer,
    FlightInfo,
    FlightAvailability,
    TranslateUtil,
} from "../core";
import { DateUtil, PromiseUtil } from "@iamyth/util";
import { Spinner } from "./util/decorator/Spinner";
import { EnquirerUtil } from "./util/EnquirerUtil";
import { BasicPromptStrategy } from "./PromptStrategies/BasicPromptStrategy";
import { DateRangePromptStrategy } from "./PromptStrategies/DateRangePromptStrategy";
import { MinMaxDaysPromptStrategy } from "./PromptStrategies/MinMaxDaysPromptStrategy";
import { CSVUtil } from "./util/CSVUtil";

export class FlightSearcherCLI {
    private flightSearcher: FlightSearcher | null;
    private flightAnalyzer: FlightPlanAnalyzer | null;
    private analyzedFlights: FlightInfo[];
    private flightAvailability: FlightAvailability | null;

    private get fs() {
        if (!this.flightSearcher) {
            throw new Error("Flight Searcher is not initialized");
        }
        return this.flightSearcher;
    }

    constructor() {
        this.flightSearcher = null;
        this.flightAnalyzer = null;
        this.analyzedFlights = [];
        this.flightAvailability = null;
    }

    async run() {
        try {
            await this.initFlightSearcher();
            await this.promptOrigin();
            await this.fetchDestinations();
            await this.promptDestination();
            await this.promptCabinClass();
            await this.promptPassenger();
            await this.fetchFlightCabinInfo();
            await this.advanceQueryPrompt();
            await this.searchFlights();
            await this.analyzeFlights();
            await this.promptSaveCSV();
            await this.promptNewSearch();
        } catch (error) {
            console.info("Terminating...");
            console.info(error);
            process.exit();
        }
    }

    private async promptOrigin() {
        await PromiseUtil.sleep(1000);
        const airportList = this.fs.airportList();
        const initialIndex = airportList.findIndex((_) => _.airportCode === "HKG");
        const airports = [...airportList.splice(initialIndex, 1), ...airportList];
        const choices = airports.map((airport) => `${airport.countryName} ${airport.shortName}`);
        const originRaw = await EnquirerUtil.autocomplete("Please select departing airport", choices, 0);
        const origin = airports.find((_) => originRaw.endsWith(_.shortName));
        this.fs.setOrigin(origin!);
        this.blankLn();
    }

    private async promptDestination() {
        await PromiseUtil.sleep(1000);
        const airports = this.fs.destinationList();
        const choices = airports.map((airport) => `${airport.countryName} ${airport.shortName}`);
        const destinationRaw = await EnquirerUtil.autocomplete("Please select departing airport", choices);
        const destination = airports.find((_) => destinationRaw.endsWith(_.shortName));
        this.fs.setDestination(destination!);
        this.blankLn();
    }

    private async promptCabinClass() {
        const choices = Object.keys(CabinClassTranslationMap);
        const cabinClassKey = await EnquirerUtil.select("Please Select Cabin Class", choices, "Economy");
        const cabinClass = CabinClassTranslationMap[cabinClassKey] || CabinClass.ECONOMY;
        this.fs.setCabinClass(cabinClass);
        this.blankLn();
    }

    private async promptPassenger() {
        const passengers = await EnquirerUtil.number("How many passengers ?", {
            initial: 1,
        });
        this.fs.setPassengers(passengers);
        this.blankLn();
    }

    private async advanceQueryPrompt() {
        await PromiseUtil.sleep(1000);
        const enableAdvanceSearch = await EnquirerUtil.select("Enable Advance Search ?", ["Yes", "No"]);
        this.blankLn();
        if (enableAdvanceSearch === "No") {
            return;
        }
        const strategies = {
            [BasicPromptStrategy.name]: BasicPromptStrategy,
            [DateRangePromptStrategy.name]: DateRangePromptStrategy,
            [MinMaxDaysPromptStrategy.name]: MinMaxDaysPromptStrategy,
        };

        const strategyName = await EnquirerUtil.select("Please Select Search Algorithm", Object.keys(strategies));
        this.blankLn();
        const strategy = new strategies[strategyName]();
        const query = await strategy.run();
        this.flightAnalyzer = new FlightPlanAnalyzer(query);
    }

    private async analyzeFlights() {
        await PromiseUtil.sleep(1000);
        const info = this.fs.info();
        if (!this.flightAnalyzer) {
            throw new Error("FlightAnalyzer is not initialized");
        }

        const { departure, arrival } = this.flightAvailability!;
        const flights = this.flightAnalyzer.analyze(departure, arrival);
        this.analyzedFlights = flights;

        console.info("----------- Flight Info -----------");
        console.info("FROM             : ", info.from);
        console.info("TO               : ", info.to);
        console.info("CABIN CLASS      : ", info.cabinClass);
        console.info("PASSENGERS       : ", info.passengers);
        console.info("FLIGHTS FOUND    : ", flights.length);
        console.info("MILES REQUIRED   : ");
        console.info("  FIRST            ", info.milesRequired.fir);
        console.info("  BUSINESS         ", info.milesRequired.bus);
        console.info("  PREMIUM ECONOMY  ", info.milesRequired.pey);
        console.info("  ECONOMY          ", info.milesRequired.eco);
        this.blankLn();
        flights.forEach((flight, index) => this.formatFlight(flight, index));
    }

    private async promptSaveCSV() {
        if (!this.analyzedFlights.length) {
            return;
        }
        await PromiseUtil.sleep(1000);
        const save = await EnquirerUtil.select("Do you want to export to .csv ?", ["Yes", "No"], "No");

        if (save === "No") {
            return;
        }

        const { fromCode, toCode, cabinClass, passengers, milesRequired } = this.fs.info();
        const date = DateUtil.format(new Date(), "with-time").replace(/ /g, "-");
        const filename = `${date}-${fromCode}-${toCode}-${cabinClass}-${passengers}.csv`;

        const cabinClasses = Object.keys(milesRequired) as CabinClass[];
        const cabinHeader = ["Miles Required", ...cabinClasses.map(TranslateUtil.cabinClass)].join(",");
        const cabinInfo = ["(Single Flight)", ...cabinClasses.map((_) => milesRequired[_])].join(",");

        const flightHeaders = ["From (Seats Avail.)", "To (Seats Avail.)", "Days", "Depart On", "Arrive On"].join(",");
        const flightInfo = this.analyzedFlights.map((flight) => {
            return [
                `${fromCode} (${flight.departure.availability})`,
                `${toCode} (${flight.arrival.availability})`,
                flight.days,
                flight.departure.date,
                flight.arrival.date,
            ].join(",");
        });

        CSVUtil.generate(filename, [cabinHeader, cabinInfo, flightHeaders, ...flightInfo]);
    }

    private async promptNewSearch() {
        const createNewSearch = await EnquirerUtil.select("Do you want to create a new search ?", ["Yes", "No"], "No");
        const yes = createNewSearch === "Yes";

        if (yes) {
            await this.run();
        } else {
            process.exit();
        }
    }

    @Spinner("Searching Required Miles...")
    private async fetchFlightCabinInfo() {
        await PromiseUtil.sleep(1000);
        await this.fs.getFlightCabinInfo();
    }

    @Spinner("Searching Available Flights...")
    private async searchFlights() {
        const flights = await this.fs.getFlightAvailability();
        await PromiseUtil.sleep(1000);
        if (!flights) {
            throw new Error("Flights not found...");
        }
        this.flightAvailability = flights;
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

    private formatFlight(flight: FlightInfo, index: number) {
        console.info("FLIGHT ", index + 1);
        console.info("=============================");
        console.info("DEPART ON    : ", `${flight.departure.date} (${flight.departure.availability})`);
        console.info("RETURN ON    : ", `${flight.arrival.date} (${flight.arrival.availability})`);
        console.info("DAYS         : ", `${flight.days} (d)`);
        this.blankLn();
    }
}
