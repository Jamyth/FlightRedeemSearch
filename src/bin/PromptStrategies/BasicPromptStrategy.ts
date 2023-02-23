import { FlightPlanQuery } from "../../core";
import { PromptStrategy } from "./PromptStrategy";

export class BasicPromptStrategy extends PromptStrategy {
    displayName: string = "BasicPromptStrategy";

    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompt) => {
            await prompt.promptMinDay();
            await prompt.promptMaxDay();
            await prompt.promptDepartingDate();
            await prompt.promptReturningDate();
        });
    }
}
