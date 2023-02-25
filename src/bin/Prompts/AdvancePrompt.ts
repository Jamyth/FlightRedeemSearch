import { FlightPlanQueryBuilder } from "../../core";
import { EnquirerUtil } from "../util/EnquirerUtil";

/**
 * Attention:
 * This is coupled with FlightPlanQueryBuilder
 * for integration of Enquirer
 */
export class AdvancePrompt {
    private queryBuilder: FlightPlanQueryBuilder;

    constructor() {
        this.queryBuilder = new FlightPlanQueryBuilder();
    }

    async promptMinDay() {
        const minDay = await EnquirerUtil.number("How many days do you want at least ?", {
            min: 1,
        });
        this.println();

        this.queryBuilder.withMinDays(minDay);
    }

    async promptMaxDay() {
        const minDay = this.queryBuilder.build().minDays;
        const maxDay = await EnquirerUtil.number("How many days do you want at most ?", {
            min: minDay,
        });
        this.println();

        this.queryBuilder.withMaxDays(maxDay);
    }

    async promptDepartingDate() {
        const departingDate = await EnquirerUtil.date("What is your starting date ?", true);
        this.println();
        this.queryBuilder.withDepartureDate(departingDate);
    }

    async promptReturningDate() {
        const returningDate = await EnquirerUtil.date("What is your starting date ?", true);
        this.println();
        this.queryBuilder.withArrivalDate(returningDate);
    }

    async promptPreferDepartureWeekday() {
        const options = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const selections = await EnquirerUtil.multiple("Prefer Departure Weekday", options);
        this.println();
        this.queryBuilder.withPreferDepartureWeekday(selections as any);
    }

    async promptPreferArrivalWeekday() {
        const options = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const selections = await EnquirerUtil.multiple("Prefer Arrival Weekday", options);
        this.println();
        this.queryBuilder.withPreferArrivalWeekday(selections as any);
    }

    getQuery() {
        return this.queryBuilder.build();
    }

    private println() {
        console.info();
    }
}
