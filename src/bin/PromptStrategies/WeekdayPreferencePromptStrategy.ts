import { FlightPlanQuery } from "../../core";
import { PromptStrategy } from "./PromptStrategy";

export class WeekdayPreferencePromptStrategy extends PromptStrategy {
    displayName: string = "WeekdayPreferencePromptStrategy";
    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompt) => {
            await prompt.promptPreferDepartureWeekday();
            await prompt.promptPreferArrivalWeekday();
        });
    }
}
