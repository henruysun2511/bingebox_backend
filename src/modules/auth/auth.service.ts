import bcrypt from "bcryptjs";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import { ENV } from "../../shares/constants/enviroment";
import { IChangePasswordBody, ILoginBody, IRegisterBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import { sendOtpEmail } from "../../utils/sendEmail";
import { default as UserModel } from "../User/user.schema";
import { default as PasswordResetModel } from "./passwordReset.schema";
import { default as SessionModel } from "./session.schema";

export class AuthService {
    private userModel = UserModel;
    private sessionModel = SessionModel;
    private passwordResetModel = PasswordResetModel;

    async register(data: IRegisterBody) {
        const { username, email, password, fullName, avatar, birth } = data;

        //Kiểm tra user đã tồn tại
        const duplicate = await this.userModel.findOne({ $or: [{ username }, { email }] });

        if (duplicate) {
            const field = duplicate.email === email ? "Email" : "Tên đăng nhập";
            throw new AppError(`${field} đã được sử dụng`, 409);
        }

        //Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            avatar,
            birth
        });
    }

    async login(data: ILoginBody) {
        const { username, password } = data;

        //Tìm người dùng theo username
        const user = await this.userModel.findOne({ username, isDeleted: false }).select("+password");

        if (!user || !user.password) {
            throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
        }

        //So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
        }

        //Tạo accsessToken
        const accessToken = Jwt.sign(
            { userId: user._id },
            ENV.ACCESS_TOKEN_SECRET as string,
            { expiresIn: ENV.ACCESS_TOKEN_TTL as any }
        );

        //Tạo refreshToken
        const refreshToken = crypto.randomBytes(64).toString("hex");

        //Lưu refreshToken vào session
        await this.sessionModel.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + ENV.REFRESH_TOKEN_TTL),
        });

        return {
            username: user.username,
            accessToken,
            refreshToken
        };
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw new AppError("Không tìm thấy refreshToken", 400);
        }
        const session = await this.sessionModel.findOneAndDelete({
            refreshToken,
        });

        if (!session) {
            throw new AppError("Session không tồn tại", 404);
        }
    }

    async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new AppError("Không tìm thấy refreshToken", 400);
        }

        const session = await this.sessionModel.findOne({ refreshToken });
        if (!session) {
            throw new AppError("Token không hợp lệ hoặc hết hạn", 404);
        }
        if (session.expiresAt < new Date()) {
            throw new AppError("Token không hợp lệ hoặc hết hạn", 404);
        }

        const accessToken = Jwt.sign(
            {
                userId: session.userId,
            },
            ENV.ACCESS_TOKEN_SECRET as string,
            { expiresIn: ENV.ACCESS_TOKEN_TTL as any }
        );

        return accessToken;
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email, isDeleted: false });

        if (!user) {
            throw new AppError("Email không tồn tại", 404);
        }

        // Xóa OTP cũ
        await this.passwordResetModel.deleteMany({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.passwordResetModel.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
        });

        await sendOtpEmail(email, otp);

        return true;
    }

    async resetPassword(email: string, otp: string, newPassword: string) {
        const record = await this.passwordResetModel.findOne({ email, otp });

        if (!record) {
            throw new AppError("OTP không hợp lệ", 400);
        }

        if (record.expiresAt < new Date()) {
            await record.deleteOne();
            throw new AppError("OTP đã hết hạn", 400);
        }

        const user = await this.userModel.findOne({ email, isDeleted: false });

        if (!user) {
            throw new AppError("Người dùng không tồn tại", 404);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Xóa OTP
        await record.deleteOne();

        return true;
    }

    async changePassword(data: IChangePasswordBody, userId: string) {
        const { oldPassword, newPassword } = data;

        const user = await this.userModel.findById(userId).select("+password");

        if (!user || !user.password) {
            throw new AppError("Người dùng không tồn tại", 404);
        }

        // Check mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new AppError("Mật khẩu cũ không đúng", 400);
        }

        // Không cho trùng mật khẩu cũ
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            throw new AppError("Mật khẩu mới phải khác mật khẩu cũ", 400);
        }

        // Hash mật khẩu mới
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        //Logout toàn bộ thiết bị
        await this.sessionModel.deleteMany({ userId });

        return true;
    }

    async googleLogin(userId: string) {
        const accessToken = Jwt.sign(
            { userId: userId },
            ENV.ACCESS_TOKEN_SECRET as string,
            { expiresIn: ENV.ACCESS_TOKEN_TTL as any }
        );

        const refreshToken = crypto.randomBytes(64).toString("hex");

        await this.sessionModel.create({
            userId: userId,
            refreshToken,
            expiresAt: new Date(Date.now() + ENV.REFRESH_TOKEN_TTL),
        });

        return {
            accessToken,
            refreshToken
        };
    }
}