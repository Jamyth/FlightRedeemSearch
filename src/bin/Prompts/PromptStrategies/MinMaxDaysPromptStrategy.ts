import { PromptStrategy } from "./PromptStrategy";
import type { FlightPlanQuery } from "../../../core";

export class MinMaxDaysPromptStrategy extends PromptStrategy {
    displayName: string = "MinMaxDaysPromptStrategy";
    run(): Promise<FlightPlanQuery> {
        return this.createPrompts(async (prompts) => {
            await prompts.promptMinDay();
            await prompts.promptMaxDay();
        });
    }
}
