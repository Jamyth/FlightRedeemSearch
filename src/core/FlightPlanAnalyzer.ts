import { AvailabilityAJAXResponse$Availability as Availability, AvailabilityTypeView } from "./type/api";

export interface FlightInfo {
    departure: Availability;
    arrival: Availability;
    days: number;
}

export class FlightPlanAnalyzer {
    private minDay: number;
    private maxDay: number;
    private departureData: Record<string, string> | null;
    private arrivalData: Record<string, string> | null;

    constructor() {
        this.minDay = 1;
        this.maxDay = 31;
        this.departureData = null;
        this.arrivalData = null;
    }

    setMinDay(minDay: number) {
        this.minDay = minDay;
    }

    setMaxDay(maxDay: number) {
        this.maxDay = maxDay;
    }

    setDepartureData(data: Record<string, string>) {
        this.departureData = data;
    }

    setArrivalData(data: Record<string, string>) {
        this.arrivalData = data;
    }

    analyze() {
        if (!this.departureData || !this.arrivalData) {
            throw new Error("Missing Required Data");
        }

        const departureList = Object.keys(this.departureData);
        const arrivalList = new Set(Object.keys(this.arrivalData));

        const result: FlightInfo[] = [];

        for (const start of departureList) {
            for (let i = this.minDay; i <= this.maxDay; i++) {
                const [year, month, day] = this.chunkDate(start);
                const shouldNextMonth = day + i > 31;
                const shouldNextYear = month + 1 > 12;
                const newDay = (day + i) % 31;
                const newMonth = shouldNextMonth ? (month + 1) % 12 : month;
                const newYear = shouldNextYear ? year + 1 : year;
                const key = `${newYear}${newMonth.toString().padStart(2, "0")}${newDay.toString().padStart(2, "0")}`;
                const hasFlight = arrivalList.has(key);

                if (hasFlight) {
                    result.push({
                        departure: {
                            date: start,
                            availability: this.departureData[start] as AvailabilityTypeView,
                        },
                        arrival: {
                            date: key,
                            availability: this.arrivalData[key] as AvailabilityTypeView,
                        },
                        days: i,
                    });
                }
            }
        }
        return result.sort((a, b) => a.days - b.days);
    }

    private chunkDate(date: string): [number, number, number] {
        const shape = [4, 2, 2];
        let offset = 0;
        const result: number[] = [];
        shape.forEach((size) => {
            result.push(parseInt(date.slice(offset, offset + size)));
            offset += size;
        });
        return result as [number, number, number];
    }
}
