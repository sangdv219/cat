## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# cat

# Create Order

1.OrderService tạo Order (status = PENDING) → phát OrderCreatedEvent.

2.InventoryService nhận event, giảm tồn kho → phát InventoryReservedEvent.

3.PaymentService nhận event, thanh toán thành công → phát PaymentCompletedEvent.

4.OrderService cập nhật Order → status = CONFIRMED.

# Luồng lỗi (thất bại):

Giả sử bước 3 (Payment) thất bại do thẻ tín dụng không hợp lệ.

Hệ thống cần Compensating Transactions để rollback các bước trước:

PaymentService phát event PaymentFailedEvent.

OrderService nhận event → cập nhật Order: status = CANCELLED.

InventoryService nhận event → bù lại tồn kho đã trừ (compensating transaction).






--> Tạm thời bỏ qua payment
