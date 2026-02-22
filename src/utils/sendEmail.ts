import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  await resend.emails.send({
    from: "BingeBox <onboarding@resend.dev>",
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