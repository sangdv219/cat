import { UUID } from "crypto";

export interface IPricingStrategy {
    caculatePrice(dto: any): number;
}
export interface IOrder {
  id: string;
  code: string;
  user_id: string;
  status: string;
  subtotal?: number;
  discount_amount?: number;
  provisional_amount?: number;
  shipping_amount?: number;
  total_amount?: number;
  payment_method_id: string;
  shipping_method_id: string;
  shipping_address: string;
  warehouse_id: string;
  tax_code?: string;
  note?: string;
  channel: string;
  voucher_applied?: string;
  extra_data?: object;
  cancel_reason?: string;
}

export interface IOrderItems {
  product_id: string;
  quantity: number;
  discount?: number;           // % hoặc số tiền, tùy logic của bạn
  note: string;
  vat: number;                // "8%", "10%", hoặc "" nếu không có
  tax_code: string;           // "VAT8", "VAT10",...
  promotion_price: number;    // giá khuyến mãi (nếu có)
  original_price: number;      // giá gốc
  final_price: number;               // giá cuối cùng sau chiết khấu/khuyến mãi (trước VAT?)
}

export interface IOrderItemsEntity extends IOrderItems {
  order_id: string;
}

export interface ICreatedOrderRequest {
  user_id: string;
  channel?: string;
  voucher_applied: string;
  extra_data: string | Record<string, any>; // hoặc JSON string
  note: string;

  shipping_address: string;

  discount_amount: number;     // tổng chiết khấu
  provisional_amount: number;  // tạm tính (thường = sum sản phẩm)
  shipping_amount: number;

  payment_method_id: string;
  shipping_method_id: string;
  warehouse_id: string;

  cancel_reason_id: string;      // chỉ có khi hủy

  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | string;

  items: IOrderItems[];
}
