import { IPricingStrategy } from "@modules/orders/interface/order.interface";

export class FlashSalePricingStrategy implements IPricingStrategy{
    caculatePrice({provisional, shipping, discount, flashSaleDiscount}): number {
        return Math.max(0, provisional + shipping - discount - flashSaleDiscount);
    }
}
export class NormalPricingStrategy implements IPricingStrategy{
    caculatePrice({provisional, shipping, discount}): number {
        return Math.max(0, provisional + shipping - discount);
    }
}

export class B2BPricingStrategy implements IPricingStrategy{
    caculatePrice({provisional, shipping, discount, b2bDiscount}): number {
        return Math.max(0, provisional + shipping - discount - b2bDiscount);
    }
}