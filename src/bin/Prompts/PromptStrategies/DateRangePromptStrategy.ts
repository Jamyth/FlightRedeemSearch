import { PromptStrategy } from "./PromptStrategy.js";
import type { FlightPlanQuery } from "../../../core/index.js";

export class DateRangePromptStrategy extends PromptStrategy {
    displayName: string = "DateRangePromptStrategy";

    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompts) => {
            await prompts.promptDepartingDate();
            await prompts.promptReturningDate();
        });
    }
}
