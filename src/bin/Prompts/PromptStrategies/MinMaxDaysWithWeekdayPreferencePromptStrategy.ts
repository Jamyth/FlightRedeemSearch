import { FlightPlanQuery } from "../../../core";
import { PromptStrategy } from "./PromptStrategy";

export class MinMaxDaysWithWeekdayPreferencePromptStrategy extends PromptStrategy {
    displayName: string = "MinMaxDaysWithWeekdayPreferencePromptStrategy";
    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompt) => {
            await prompt.promptMinDay();
            await prompt.promptMaxDay();
            await prompt.promptPreferDepartureWeekday();
            await prompt.promptPreferArrivalWeekday();
        });
    }
}
