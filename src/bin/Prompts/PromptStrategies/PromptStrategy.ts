import type { FlightPlanQuery } from "../../../core/index.js";
import { AdvancePrompt } from "../AdvancePrompt.js";

export abstract class PromptStrategy {
    abstract displayName: string;
    abstract run(): Promise<FlightPlanQuery>;

    protected async createPrompts(runner: (prompt: AdvancePrompt) => void) {
        const prompt = new AdvancePrompt();
        try {
            await runner(prompt);
        } catch (error) {
            console.error(`[${this.displayName}]: QueryFailed`);
        }
        return prompt.getQuery();
    }
}
