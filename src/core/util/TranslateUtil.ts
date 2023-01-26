import { CabinClass } from "../type/api";

export const CabinClassTranslationMap: Record<string, CabinClass> = {
    "First Class": CabinClass.FIRST,
    Business: CabinClass.BUSINESS,
    "Premium Economy": CabinClass.PREMIUM_ECONOMY,
    Economy: CabinClass.ECONOMY,
} as const;

function cabinClass(type: CabinClass): string {
    switch (type) {
        case CabinClass.FIRST:
            return "First";
        case CabinClass.BUSINESS:
            return "Business";
        case CabinClass.PREMIUM_ECONOMY:
            return "Premium Economy";
        case CabinClass.ECONOMY:
            return "Economy";
    }
}

export const TranslateUtil = Object.freeze({
    cabinClass,
});
