import type { FlightPlanQuery } from "../../../core/index.js";
import { PromptStrategy } from "./PromptStrategy.js";

export class BasicPromptStrategy extends PromptStrategy {
    displayName: string = "BasicPromptStrategy";

    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompt) => {
            await prompt.promptMinDay();
            await prompt.promptMaxDay();
            await prompt.promptDepartingDate();
            await prompt.promptReturningDate();
            await prompt.promptPreferDepartureWeekday();
            await prompt.promptPreferArrivalWeekday();
        });
    }
}
