import { PromptStrategy } from "./PromptStrategy";
import type { FlightPlanQuery } from "../../../core";

export class DateRangePromptStrategy extends PromptStrategy {
    displayName: string = "DateRangePromptStrategy";

    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompts) => {
            await prompts.promptDepartingDate();
            await prompts.promptReturningDate();
        });
    }
}
