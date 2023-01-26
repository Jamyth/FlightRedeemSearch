import { FlightSearcher } from "@core/FlightSearcher";
import { Module, register, Loading, JavaScriptException } from "react-shiba";
import { Main } from "./Main";
import type { State, Path } from "./type";

const initialState: State = {};

class MainModule extends Module<Path, State> {
    flightSearcher: FlightSearcher | null = null;

    get fs() {
        if (!this.flightSearcher) {
            throw new JavaScriptException("Flight Searcher is not initialized", null);
        }
        return this.flightSearcher;
    }

    override async onEnter() {
        await this.createFlightSearcher();
    }

    @Loading("flight-searcher")
    private async createFlightSearcher() {
        const fs = new FlightSearcher();
        await fs.init();
        this.flightSearcher = fs;
    }
}

const mainModule = register(new MainModule(null, initialState));
export const useState = mainModule.getState();
export const actions = mainModule.getActions();
export const MainComponent = mainModule.attachLifecycle(Main);
