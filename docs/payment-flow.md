# Luồng Thanh Toán (Payment Flow)

## Kiến trúc

```
Frontend                     Backend                          SePay (Bank Gateway)
   │                            │                                 │
   │  POST /bookings           │                                 │
   │ ─────────────────────────►│                                 │
   │   { showtimeId, seatIds,  │                                 │
   │     foods, voucherCode,   │                                 │
   │     pointsUsed }          │                                 │
   │                           │ Tạo Booking (PENDING)           │
   │                           │ + Tickets (UNPAID, 10 phút)     │
   │◄───────────────────────── │                                 │
   │  { booking, finalAmount } │                                 │
   │                           │                                 │
   │  POST /payments           │                                 │
   │ ─────────────────────────►│                                 │
   │   { bookingId }           │                                 │
   │  (auth required)          │ Kiểm tra quyền sở hữu           │
   │                           │ + Tạo Payment (PENDING)         │
   │◄───────────────────────── │                                 │
   │  { referenceCode, amount }│                                 │
   │                           │                                 │
   │  Frontend sinh VietQR     │                                 │
   │  User chuyển khoản ────────────── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─►│
   │                           │                                 │
   │                           │  POST /payments/sepay-webhook   │
   │                           │◄────────────────────────────────│
   │                           │  { transactionId, amount,       │
   │                           │    content: "BINGEBOX_<id>" }   │
   │                           │                                 │
   │                           │ Validate + Update               │
   │                           │ Booking → SUCCESS               │
   │                           │ Tickets → PAID                  │
   │                           │ + Điểm + Email                  │
   │                           │ + Socket "seat:update"(PAID)    │
```

## Chi tiết các bước

### 1. Tạo Booking (`POST /bookings`)
- **File:** `src/modules/booking/booking.service.ts` → `createBooking()`
- **Xác thực:** User, showtime, room, seats (chưa có ai đặt)
- **Tính toán:** Giá vé, giá đồ ăn, voucher, điểm, membership discount
- **Kết quả:**
  - Booking: `status: PENDING`, `expiresAt: now + 10 phút`
  - Tickets: `status: UNPAID`, `expiresAt: now + 10 phút` (giữ ghế)
- **Transaction:** Toàn bộ trong MongoDB session → rollback nếu lỗi

### 2. Tạo Payment (`POST /payments`)
- **File:** `src/modules/payment/payment.service.ts` → `createPayment()`
- **Validate quyền sở hữu:** `findOne({ _id: bookingId, userId })` — người khác không thể tạo payment
- **Chống duplicate:** Nếu booking đã có payment PENDING thì trả về cái cũ
- **Tạo `referenceCode`:** Format `BINGEBOX_<bookingId>` — đây là nội dung chuyển khoản
- **Kết quả:**
  - Payment: `status: PENDING`, `referenceCode: "BINGEBOX_<id>"`
- **Frontend dùng `referenceCode` + `amount` để sinh VietQR**

### 3. Xử lý Webhook SePay (`POST /payments/sepay-webhook`)
- **File:** `src/modules/payment/payment.service.ts` → `handleSePayWebhook()`
- **Route:** `express.text({ type: "*/*" })` — giữ nguyên raw body để verify signature
- **Idempotent:** `findOne({ bankTransactionId })` → nếu đã xử lý thì skip
- **Match booking:** Parse `content` lấy `bookingId` từ prefix `BINGEBOX_`
- **Validate số tiền:** `payment.amount === webhook.amount`
- **Transaction:** Cập nhật Payment, Booking, Tickets, User points trong 1 session

### 4. Hậu xử lý thành công
- Booking → `SUCCESS`
- Tickets → `PAID`, `expiresAt: null`
- User → `currentPoints += pointsEarned`, `totalSpending += finalAmount`
- Socket → `seat:update { type: "PAID" }` tới room `showtime-<id>`
- Email → Gửi vé xác nhận qua Nodemailer (CID attachments cho QR)

### 5. Hủy thanh toán (`POST /payments/fail`)
- **File:** `src/modules/payment/payment.service.ts` → `handleFailedPayment()`
- **Validate:** Chỉ cho phép nếu `bookingStatus === PENDING`
- Booking → `FAILED`
- Tickets → `CANCELLED`, `expiresAt: null`
- Payment → `FAILED`
- **Hoàn điểm:** Nếu `pointsUsed > 0`, trả lại cho user
- Socket → `seat:update { type: "RELEASE" }` — ghế được giải phóng

## Database Schema

### Payment (`src/modules/payment/payment.schema.ts`)
```
booking:          ObjectId → Booking  (ref)
referenceCode:    String, unique      ("BINGEBOX_<bookingId>")
bankTransactionId: String?            (từ webhook SePay, dùng idempotent)
amount:           Number
method:           Enum [SEPAY, VNPAY, MOMO, PAYOS]
status:           Enum [pending, success, failed]
```

### Indexes
- `{ booking: 1 }` — tìm payment theo booking
- `{ referenceCode: 1 }` — unique
- `{ bankTransactionId: 1 }` — chống duplicate webhook
- `{ status: 1 }` — lọc payment đang chờ

## File Inventory

| File | Vai trò |
|---|---|
| `src/modules/payment/payment.service.ts` | Core: tạo payment, xử lý webhook, fail |
| `src/modules/payment/payment.controller.ts` | 3 endpoints |
| `src/modules/payment/payment.route.ts` | Routes + raw body parser cho webhook |
| `src/modules/payment/payment.schema.ts` | Mongoose model + indexes |
| `src/modules/payment/payment.interface.ts` | TypeScript interface |
| `src/configs/mail.config.ts` | Nodemailer transporter |
| `src/utils/sendEmail.ts` | Gửi OTP + ticket email |
