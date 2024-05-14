import type { FlightPlanQuery } from "../../../core/index.js";
import { PromptStrategy } from "./PromptStrategy.js";

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
