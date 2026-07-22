# BingeBox Cinema - Backend API

Hệ thống backend cho ứng dụng đặt vé xem phim BingeBox Cinema.

## Công nghệ

- **Runtime:** Node.js 18+, TypeScript
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose 9
- **Authentication:** JWT + Passport (Google OAuth2)
- **Cache:** Redis (ioredis) — movie/showtime/dashboard cache + rate-limit store
- **Queue (optional):** BullMQ-ready
- **Realtime:** Socket.IO (seat hold/release)
- **Email:** Nodemailer (Gmail SMTP)
- **File upload:** Cloudinary + Multer
- **Validation:** Zod 4
- **Cron:** node-cron (release expired seats)

## Cấu trúc

```
src/
├── configs/           # Kết nối DB, Redis, Socket, Mail, Passport, Cloudinary
├── crons/             # Cron jobs (releaseSeat)
├── middlewares/       # Auth, authorization, validation, rate-limit, error, upload
├── modules/           # Feature modules (mỗi module: route, controller, service, schema, validation, interface)
│   ├── auth/          # Đăng nhập, đăng ký, OAuth Google, quên mật khẩu
│   ├── booking/       # Đặt vé, tạo booking
│   ├── payment/       # Thanh toán SePay QR, webhook
│   ├── movie/         # Phim, danh sách, yêu thích
│   ├── showtime/      # Suất chiếu, lịch chiếu theo rạp/phim
│   ├── seat/          # Ghế, giữ ghế (socket gateway)
│   ├── ticket/        # Vé
│   ├── dashboard/     # Thống kê admin, doanh thu, occupancy
│   ├── cinema/        # Rạp
│   ├── room/          # Phòng chiếu
│   ├── voucher/       # Mã giảm giá
│   ├── food/          # Đồ ăn
│   ├── comment/       # Bình luận phim
│   └── ...
└── shares/constants/  # Enum, environment (ENV)
```

## Yêu cầu

- Node.js >= 18
- MongoDB (local hoặc Atlas)
- Redis (local hoặc cloud) — optional, cache sẽ bypass nếu Redis offline
- Tài khoản Gmail (SMTP) + Cloudinary

## Cài đặt

```bash
npm install
cp .env.example .env   # hoặc copy từ .env có sẵn
```

### Biến môi trường (.env)

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `PORT` | | Cổng server (mặc định 3000) |
| `MONGODB_CONNECTION_STRING` | ✅ | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | ✅ | Secret ký JWT |
| `ACCESS_TOKEN_TTL` | | Thời hạn access token (mặc định 30m) |
| `REFRESH_TOKEN_TTL` | | Thời hạn refresh token (mặc định 7d) |
| `EMAIL_HOST` | | SMTP host (mặc định smtp.gmail.com) |
| `EMAIL_PORT` | | SMTP port (mặc định 587) |
| `EMAIL_USER` | ✅ | Gmail address gửi email |
| `EMAIL_PASSWORD` | ✅ | App password Gmail |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | ✅ | Google OAuth callback URL |
| `CLOUDINARY_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `SEPAY_WEBHOOK_SECRET` | ✅ | Secret HMAC cho SePay webhook |
| `REDIS_URL` | | Redis URL (mặc định redis://localhost:6379) |
| `CLIENT_URL` | | FE URL cho CORS |
| `CLIENT_URL_2` | | FE URL phụ cho CORS |
| `NODE_ENV` | | Môi trường (development/production) |

## Chạy

```bash
npm run dev      # Development với hot-reload
npm run build    # Build TypeScript
npm start        # Production
```

## API Endpoints

### Auth
| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/login` | Đăng nhập (rate-limit: 5/phút) |
| POST | `/api/v1/auth/logout` | Đăng xuất |
| POST | `/api/v1/auth/refresh-token` | Refresh token |
| POST | `/api/v1/auth/forgot-password` | Quên mật khẩu (rate-limit: 3/giờ) |
| POST | `/api/v1/auth/reset-password` | Đặt lại mật khẩu |
| POST | `/api/v1/auth/change-password` | Đổi mật khẩu |
| GET | `/api/v1/auth/google` | Đăng nhập Google |

### Movies
| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/v1/movies` | Danh sách phim (cache 5 phút) |
| GET | `/api/v1/movies/:id` | Chi tiết phim (cache 10 phút) |
| POST | `/api/v1/movies` | Tạo phim |
| PATCH | `/api/v1/movies/:id` | Cập nhật phim |
| DELETE | `/api/v1/movies/:id` | Xoá phim |
| POST | `/api/v1/movies/likes/:id` | Like/unlike phim |

### Showtimes
| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/v1/showtimes` | Danh sách suất chiếu |
| GET | `/api/v1/showtimes/:id` | Chi tiết suất chiếu |
| GET | `/api/v1/showtimes/cinemas/:cinemaId` | Lịch chiếu theo rạp (cache 2 phút) |
| GET | `/api/v1/showtimes/movies/:movieId` | Lịch chiếu theo phim (cache 2 phút) |
| GET | `/api/v1/showtimes/cinemas/:cinemaId/rooms` | Lịch chiếu gom theo phòng (cache 2 phút) |

### Booking
| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/v1/bookings` | Tạo booking + giữ ghế |
| GET | `/api/v1/bookings/:id` | Chi tiết booking |

### Payment
| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/v1/payments` | Tạo giao dịch thanh toán |
| GET | `/api/v1/payments/:bookingId/status` | Trạng thái thanh toán (polling) |
| POST | `/api/v1/payments/sepay-webhook` | Webhook SePay |
| POST | `/api/v1/payments/fail` | Hủy thanh toán |

### Dashboard (Admin)
| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/v1/dashboards/general-stats` | Thống kê tổng quan (cache 15 phút) |
| GET | `/api/v1/dashboards/revenue` | Doanh thu theo tháng |
| GET | `/api/v1/dashboards/ticket-sales` | Vé bán theo tháng |
| GET | `/api/v1/dashboards/top-movies` | Top phim doanh thu |
| GET | `/api/v1/dashboards/top-customers` | Top khách hàng |
| GET | `/api/v1/dashboards/customer-growth` | Tăng trưởng user |
| GET | `/api/v1/dashboards/membership-distribution` | Phân bố hạng thành viên |
| GET | `/api/v1/dashboards/showtime-sales` | Vé theo khung giờ |
| GET | `/api/v1/dashboards/occupancy` | Tỷ lệ lấp đầy |

## Rate Limiting

- **General API:** 100 requests/phút/IP
- **Login:** 5 requests/phút/IP
- **Forgot Password:** 3 requests/giờ/IP
- Fallback về bộ nhớ nếu Redis offline

## Cache (Redis)

| Cache key | TTL | Ghi chú |
|---|---|---|
| `movies:*` | 5 phút | Xoá khi tạo/sửa/xoá phim |
| `movie:{id}` | 10 phút | |
| `showtimes:cinema:*` | 2 phút | Xoá khi tạo/sửa/xoá suất chiếu |
| `showtimes:movie:*` | 2 phút | |
| `showtimes:room:*` | 2 phút | |
| `dashboard:*` | 15 phút | Tất cả aggregate dashboard |

## Thanh toán

Tích hợp **SePay QR** — bank transfer:
- User chuyển khoản tới tài khoản cố định với nội dung `BINGEBOX_{bookingId}`
- SePay gửi webhook → server xác thực HMAC → xử lý transaction → emit socket → gửi email
- Frontend poll `GET /payments/:bookingId/status` mỗi 5s → auto-redirect khi SUCCESS
