import type { FlightPlanQuery } from "../../core";
import { AdvancePrompt } from "./AdvancePrompt";

export abstract class PromptStrategy {
    abstract displayName: string;
    abstract run(): Promise<FlightPlanQuery>;

    protected async createPrompts(runner: (prompt: AdvancePrompt) => void) {
        const prompt = new AdvancePrompt();
        try {
            await runner(prompt);
        } catch (error) {
            console.error(`[${this.displayName}]: QueryFailed`);
        } finally {
            return prompt.getQuery();
        }
    }
}
