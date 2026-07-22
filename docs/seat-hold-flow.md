# Luồng Giữ Ghế Realtime (Seat Holding Flow)

## Kiến trúc 3 lớp

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LỚP 1: UI TEMPORARY HOLD (Socket.io - Chỉ hiển thị)                   │
│  ─────────────────────────────────────────────────────────────────────── │
│  Client A              Socket Server              Client B              │
│    │                       │                        │                   │
│    │ "join-showtime"       │                        │ "join-showtime"   │
│    │─────────────────────► │◄───────────────────────│                   │
│    │                       │                        │                   │
│    │ "hold-seat"           │                        │                   │
│    │ { seatId: "A1" }     │                        │                   │
│    │─────────────────────► │                        │                   │
│    │                       │ "seat:held"            │                   │
│    │                       │ { seatId: "A1" }      │──────────────────►│
│    │                       │                        │ Ghế A1 bị mờ      │
│    │ "release-seat"        │                        │                   │
│    │ { seatId: "A1" }     │                        │                   │
│    │─────────────────────► │                        │                   │
│    │                       │ "seat:released"        │                   │
│    │                       │ { seatId: "A1" }      │──────────────────►│
│    │                       │                        │ Ghế A1 sáng lại   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  LỚP 2: BACKEND HOLD (Booking + Ticket - Có transaction)               │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                         │
│  POST /bookings (auth)                                                  │
│  → createBooking()                                                      │
│    ├── validateSeats(): kiểm tra ghế chưa có ticket PAID/UNPAID        │
│    ├── Tạo Booking { status: PENDING, expiresAt: now + 10 phút }       │
│    └── Tạo Tickets { status: UNPAID, expiresAt: now + 10 phút }        │
│                                                                         │
│  MongoDB unique partial index: (showtime, seat) where status ≠ CANCELLED│
│  → Chỉ 1 ticket active/ghế/suất chiếu                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  LỚP 3: HOLD EXPIRY (Cron job - Giải phóng sau 10 phút)               │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                         │
│  CRON: */1 * * * *                                                      │
│  → Ticket.updateMany({ UNPAID, expiresAt < now }) → CANCELLED           │
│  → Booking.updateMany({ PENDING, expiresAt < now }) → FAILED            │
│                                                                         │
│  Khi thanh toán thành công:                                             │
│  → Payment webhook → Ticket → PAID, Booking → SUCCESS                   │
│  → Socket emit "seat:update" { type: "PAID" }                          │
│                                                                         │
│  Khi thanh toán thất bại / hủy:                                        │
│  → /payments/fail → Ticket → CANCELLED, Booking → FAILED                │
│  → Socket emit "seat:update" { type: "RELEASE" }                       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Chi tiết từng lớp

### Lớp 1: UI Hold (Socket.io — Visual-only)
**Mục đích:** Khi người dùng click chọn ghế, ghế sẽ hiển thị "đang có người chọn" cho người khác ngay lập tức, trước khi bấm đặt.

**File:** `src/modules/seat/seat.gateway.ts`

| Socket Event | Hướng | Mô tả |
|---|---|---|
| `join-showtime` | Client → Server | Join room `showtime-<showtimeId>` |
| `hold-seat` | Client → Server | User chọn ghế (broadcast trừ sender) |
| `release-seat` | Client → Server | User bỏ chọn ghế (broadcast trừ sender) |
| `seat:held` | Server → Client | Ghế đang được người khác chọn |
| `seat:released` | Server → Client | Ghế đã được bỏ chọn |
| `seat:update` | Server → Client | Ghế đã được thanh toán (`PAID`) hoặc hủy (`RELEASE`) |

**Đặc điểm:**
- **Không persist** — chỉ là tín hiệu realtime, nếu refresh trang sẽ mất
- Dùng `socket.to(roomName)` để broadcast trừ người gửi (không cần tự hủy trên UI của mình)
- Server không validate quyền — bất kỳ client nào trong room cũng có thể hold/release

### Lớp 2: Backend Hold (Booking + Ticket — Persistent)
**Mục đích:** Khi user bấm "Đặt vé", ghế được giữ cứng trong 10 phút, người khác không thể đặt được.

**File:** `src/modules/booking/booking.service.ts` → `createBooking()`

#### Quy trình:

1. **Validate Seats** (`SeatService.validateSeats`)
   - Kiểm tra ghế có tồn tại không
   - Query `Ticket.find({ showtime, seat, status ≠ CANCELLED })`
   - Nếu có ticket active → throw `"Ghế đã được đặt"` (409)

2. **Tạo Booking**
   - `status: PENDING`
   - `expiresAt: now + 10 phút`

3. **Tạo Ticket cho mỗi ghế**
   - `status: UNPAID`
   - `expiresAt: now + 10 phút`
   - `qrCode: base64` (dùng cho email)

4. **Unique Index bảo vệ**
   ```javascript
   ticketSchema.index(
     { showtime: 1, seat: 1 },
     { unique: true, partialFilterExpression: { status: { $ne: 'CANCELLED' } } }
   );
   ```
   - Chỉ 1 ticket PAID hoặc UNPAID được phép tồn tại cho 1 ghế trong 1 suất chiếu
   - Nếu CANCELLED rồi thì được phép tạo lại

**Toàn bộ trong MongoDB transaction** — nếu bất kỳ bước nào fail, rollback hết.

### Lớp 3: Hold Expiry (Cron + Payment)
**Mục đích:** Giải phóng ghế khi hết thời gian giữ hoặc khi thanh toán.

#### Expiry tự động (Cron job)
**File:** `src/crons/releaseSeat.cron.ts`
- **Tần suất:** Mỗi 1 phút (`*/1 * * * *`)
- **Hành động:**
  ```
  Ticket.updateMany({ UNPAID, expiresAt < now })
    → { status: CANCELLED, expiresAt: null }
  
  Booking.updateMany({ PENDING, expiresAt < now })
    → { status: FAILED }
  ```
- **Giới hạn:** Cron không emit socket → Frontend cần gọi lại `getSeatsByShowtime` để cập nhật

#### Thanh toán thành công
**File:** `src/modules/payment/payment.service.ts` → `handleSePayWebhook()`
- `Ticket.updateMany({ booking }) → { status: PAID, expiresAt: null }`
- `Booking → { status: SUCCESS }`
- Socket: `seat:update { type: "PAID" }`

#### Thanh toán thất bại / Hủy
**File:** `src/modules/payment/payment.service.ts` → `handleFailedPayment()`
- `Ticket.updateMany({ booking }) → { status: CANCELLED, expiresAt: null }`
- `Booking → { status: FAILED }`
- **Hoàn điểm** nếu user đã dùng điểm
- Socket: `seat:update { type: "RELEASE" }`

## Query trạng thái ghế

**File:** `src/modules/seat/seat.service.ts` → `getSeatsByShowtime(showtimeId)`

```
GET /api/seats/showtimes/:showtimeId
```

Trả về mỗi ghế với 1 trong 3 trạng thái:

| Trạng thái | Ý nghĩa | Điều kiện |
|---|---|---|
| `AVAILABLE` | Còn trống | Không có ticket active |
| `HOLD` | Đang giữ | Ticket UNPAID + expiresAt > now |
| `SOLD` | Đã bán | Ticket PAID |

## File Inventory

| File | Vai trò |
|---|---|
| `src/modules/seat/seat.gateway.ts` | Socket handler: hold/release/join-showtime |
| `src/modules/seat/seat.service.ts` | `getSeatsByShowtime` + `validateSeats` |
| `src/modules/booking/booking.service.ts` | Tạo booking + ticket (hold cứng) |
| `src/modules/payment/payment.service.ts` | Payment success/failure → update ticket status |
| `src/crons/releaseSeat.cron.ts` | Cron giải phóng ghế hết hạn |
| `src/configs/socket.config.ts` | Khởi tạo Socket.io server |
| `src/modules/ticket/ticket.schema.ts` | Ticket model + unique partial index |
