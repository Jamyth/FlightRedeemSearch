import { FlightPlanQueryBuilder } from "../../core";
import { EnquirerUtil } from "../util/EnquirerUtil";

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
        this.queryBuilder.withDepartureDate(departingDate);
    }

    async promptReturningDate() {
        const returningDate = await EnquirerUtil.date("What is your starting date ?", true);
        this.queryBuilder.withArrivalDate(returningDate);
    }

    getQuery() {
        return this.queryBuilder.build();
    }

    private println() {
        console.info();
    }
}
