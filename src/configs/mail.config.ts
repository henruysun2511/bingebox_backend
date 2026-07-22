import nodemailer from "nodemailer";
import { ENV } from "../shares/constants/environment";

const user = ENV.EMAIL_USER;
export const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: false,
    auth: { user, pass: ENV.EMAIL_PASSWORD },
});
export const emailFrom = `"BingeBox" <${user}>`;
