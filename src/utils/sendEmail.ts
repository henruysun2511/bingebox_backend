import { transporter, emailFrom } from "../configs/mail.config";

export async function sendOtpEmail(email: string, otp: string) {
    await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject: "Mã OTP đặt lại mật khẩu - BingeBox",
        html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="text-align: center; margin-bottom: 28px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px;">
            BINGE<span style="color: #edd463;">BOX</span>
          </h1>
        </div>
        <div style="background-color: #0a0a0a; padding: 36px 30px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.06);">
          <h2 style="color: #ffffff; font-size: 18px; margin-top: 0; margin-bottom: 12px; font-weight: 600;">Đặt lại mật khẩu</h2>
          <p style="color: #a5bfe0; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">
            Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực dưới đây:
          </p>
          <div style="background: linear-gradient(135deg, rgba(31, 31, 74, 0.6), rgba(53, 53, 163, 0.4)); color: #edd463; font-size: 34px; font-weight: bold; text-align: center; padding: 22px; border-radius: 10px; letter-spacing: 8px; margin-bottom: 28px; border: 1px solid rgba(237, 212, 99, 0.2);">
            ${otp}
          </div>
          <p style="color: #74b0e1; font-size: 13px; text-align: center; margin: 0; line-height: 1.4;">
            Mã OTP này có hiệu lực trong vòng <strong style="color: #efb146;">5 phút</strong>.<br>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
          </p>
        </div>
        <div style="text-align: center; margin-top: 24px; color: #525252; font-size: 12px;">
          <p style="margin: 0;">© 2026 BingeBox Cinema. All rights reserved.</p>
        </div>
      </div>
    `,
    });
}

export interface TicketSeatData {
    code: string;
    price: number;
    qrCode: string;
}

export interface TicketFoodData {
    name: string;
    quantity: number;
    price: number;
}

export interface TicketEmailData {
    email: string;
    customerName: string;
    cinemaName: string;
    roomName: string;
    movieName: string;
    startTime: Date;
    seats: TicketSeatData[];
    foods: TicketFoodData[];
    totalAmount: number;
}

export function buildTicketEmailHtml(data: TicketEmailData): string {
    const seatRows = data.seats.map(seat => {
        const cid = `qr-${seat.code.replace(/\s+/g, "")}`;
        return `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; text-align: center; color: #1f2937; font-weight: 600; font-size: 14px;">${seat.code}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; text-align: right; color: #2563eb; font-size: 14px;">${seat.price.toLocaleString('vi-VN')}đ</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; text-align: center;">
          <img src="cid:${cid}" alt="QR ${seat.code}" width="55" height="55" style="display: block; margin: 0 auto;"/>
        </td>
      </tr>
    `;
    }).join('');

    const foodRows = data.foods.map(food => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; color: #1f2937; font-size: 14px;">${food.name}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; text-align: center; color: #6b7280; font-size: 14px;">${food.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #d1d5db; text-align: right; color: #2563eb; font-size: 14px;">${(food.price * food.quantity).toLocaleString('vi-VN')}đ</td>
    </tr>
  `).join('');

    const formattedDate = data.startTime.toLocaleDateString("vi-VN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const formattedTime = data.startTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit", minute: "2-digit",
    });

    return `
    <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f3f4f6; padding: 30px 12px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 2px;">
            BINGE<span style="color: #edd463;">BOX</span>
          </h1>
          <p style="color: rgba(255,255,255,0.75); font-size: 11px; margin: 6px 0 0 0; letter-spacing: 2px; text-transform: uppercase;">Thông tin đặt vé</p>
        </div>

        <div style="padding: 24px;">

          <div style="text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px dashed #d1d5db;">
            <div style="font-size: 36px; margin-bottom: 4px;">&#10004;&#65039;</div>
            <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">
              Xin chào <strong style="color: #1f2937;">${data.customerName}</strong>,<br/>cảm ơn bạn đã đặt vé tại BingeBox.
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="color: #004aad; font-weight: 600; margin-bottom: 6px; font-size: 14px;">Suất chiếu</div>
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 14px; font-size: 14px; color: #1f2937;">
              <div style="font-weight: bold; font-size: 16px; color: #000; margin-bottom: 4px;">${data.movieName}</div>
              <div style="color: #6b7280;">${data.cinemaName}</div>
              <div style="color: #6b7280;">${data.roomName}</div>
              <div style="color: #004aad; font-weight: 600; margin-top: 4px;">${formattedTime} &bull; ${formattedDate}</div>
            </div>
          </div>

          <hr style="border: 0; border-top: 2px dashed #d1d5db; margin: 20px 0;" />

          <div style="margin-bottom: 20px;">
            <div style="color: #004aad; font-weight: 600; margin-bottom: 6px; font-size: 14px;">Ghế đã đặt</div>
            <div style="background-color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #004aad; color: #ffffff;">
                    <th style="padding: 8px 12px; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase;">Ghế</th>
                    <th style="padding: 8px 12px; text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase;">Giá</th>
                    <th style="padding: 8px 12px; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase;">QR</th>
                  </tr>
                </thead>
                <tbody style="background: #ffffff;">${seatRows}</tbody>
              </table>
            </div>
          </div>

          <hr style="border: 0; border-top: 2px dashed #d1d5db; margin: 20px 0;" />

          ${data.foods.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <div style="color: #004aad; font-weight: 600; margin-bottom: 6px; font-size: 14px;">Bắp nước</div>
              <div style="background-color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #454d6a; color: #ffffff;">
                      <th style="padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase;">Tên</th>
                      <th style="padding: 8px 12px; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase;">SL</th>
                      <th style="padding: 8px 12px; text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase;">Giá</th>
                    </tr>
                  </thead>
                  <tbody style="background: #ffffff;">${foodRows}</tbody>
                </table>
              </div>
            </div>
            <hr style="border: 0; border-top: 2px dashed #d1d5db; margin: 20px 0;" />
          ` : ''}

          <div style="margin-bottom: 20px;">
            <div style="color: #004aad; font-weight: 600; margin-bottom: 6px; font-size: 14px;">Thanh toán</div>
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280; font-size: 14px;">Tổng tiền</span>
              <span style="font-weight: bold; font-size: 20px; color: #2563eb;">${data.totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 16px;">
            <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 4px 20px; border-radius: 999px; font-size: 13px; font-weight: 500;">Đã thanh toán</span>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.5; border-top: 2px dashed #d1d5db; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">Email tự động, vui lòng không phản hồi.</p>
            <p style="margin: 0;">&copy; 2026 BingeBox Cinema. All rights reserved.</p>
          </div>

        </div>
      </div>
    </div>
  `;
}

export async function sendTicketEmail(data: TicketEmailData) {
    const attachments: {
        filename: string;
        content: string;
        cid: string;
        encoding: string;
    }[] = [];

    for (const seat of data.seats) {
        const cid = `qr-${seat.code.replace(/\s+/g, "")}`;
        const base64Match = seat.qrCode.match(/^data:image\/\w+;base64,(.+)$/);
        if (base64Match) {
            attachments.push({
                filename: `${cid}.png`,
                content: base64Match[1],
                cid,
                encoding: "base64",
            });
        }
    }

    await transporter.sendMail({
        from: emailFrom,
        to: data.email,
        subject: `Xác nhận đặt vé thành công - ${data.movieName}`,
        attachments,
        html: buildTicketEmailHtml(data),
    });
}
