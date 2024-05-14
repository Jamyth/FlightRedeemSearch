import type { FlightPlanQuery } from "../../../core/index.js";
import { PromptStrategy } from "./PromptStrategy.js";

export class WeekdayPreferencePromptStrategy extends PromptStrategy {
    displayName: string = "WeekdayPreferencePromptStrategy";
    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompt) => {
            await prompt.promptPreferDepartureWeekday();
            await prompt.promptPreferArrivalWeekday();
        });
    }
}
