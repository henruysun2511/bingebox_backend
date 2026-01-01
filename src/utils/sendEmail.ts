import nodemailer from "nodemailer";
import { ENV } from "../shares/constants/enviroment";

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"BingeBox Cinema" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: "Mã OTP đặt lại mật khẩu",
    html: `
      <h2>Quên mật khẩu</h2>
      <p>Mã OTP của bạn là:</p>
      <h1>${otp}</h1>
      <p>OTP có hiệu lực trong 5 phút</p>
    `,
  });
}