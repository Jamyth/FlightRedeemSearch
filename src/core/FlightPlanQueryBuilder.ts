export interface FlightPlanQuery {
    minDays?: number;
}

export class FlightPlanQueryBuilder {
    private query: FlightPlanQuery;

    constructor() {
        this.query = {};
    }

    withMinDays(minDays: number) {
        this.query.minDays = minDays;
    }

    build() {
        return this.query;
    }
}
