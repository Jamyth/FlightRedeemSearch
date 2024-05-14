import { PromptStrategy } from "./PromptStrategy.js";
import type { FlightPlanQuery } from "../../../core/index.js";

export class MinMaxDaysPromptStrategy extends PromptStrategy {
    displayName: string = "MinMaxDaysPromptStrategy";
    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompts) => {
            await prompts.promptMinDay();
            await prompts.promptMaxDay();
        });
    }
}
