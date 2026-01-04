import { PricingType } from "@core/enum/pg-error-codes.enum";
import { FlashSalePricingStrategy, NormalPricingStrategy } from "./strategies";
import { IPricingStrategy } from "@modules/orders/interface/order.interface";

const registry: Record<PricingType,IPricingStrategy> ={
    [PricingType.NORMAL]: new NormalPricingStrategy(),
    [PricingType.FLASH_SALE]: new FlashSalePricingStrategy(),
}

export class PricingStrategyFactory {
    static create(type: PricingType): IPricingStrategy {
        const strategy = registry[type];
        if (!strategy) {
            throw new Error(`Pricing strategy for type ${type} not found.`);
        }
        return strategy;
    }
}
