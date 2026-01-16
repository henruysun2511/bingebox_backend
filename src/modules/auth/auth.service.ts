import bcrypt from "bcryptjs";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import { ENV } from "../../shares/constants/enviroment";
import { IChangePasswordBody, ILoginBody, IRegisterBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import { sendOtpEmail } from "../../utils/sendEmail";
import { default as MembershipModel } from "../membership/membership.schema";
import { default as RoleModel } from "../role/role.schema";
import { default as UserModel } from "../user/user.schema";
import { default as PasswordResetModel } from "./passwordReset.schema";
import { default as SessionModel } from "./session.schema";

export class AuthService {
    private userModel = UserModel;
    private sessionModel = SessionModel;
    private passwordResetModel = PasswordResetModel;
    private roleModel = RoleModel;
    private membershipModel = MembershipModel;

    private async generateAuthTokens(user: any) {
        // 1. Lấy thông tin Role và Avatar
        const userWithRole = await this.userModel.findById(user._id).populate("role");
        const role = (userWithRole?.role as any)?.name || "CUSTOMER";

        // 2. Tạo Access Token (Payload khớp hoàn toàn với UserJwtPayload của Frontend)
        const accessToken = Jwt.sign(
            {
                sub: user._id,
                username: user.username,
                role,
                avatar: user.vatar
            },
            ENV.ACCESS_TOKEN_SECRET as string,
            { expiresIn: ENV.ACCESS_TOKEN_TTL as any }
        );

        // 3. Tạo Refresh Token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // 4. Lưu vào Database Session
        await this.sessionModel.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + Number(ENV.REFRESH_TOKEN_TTL)),
        });

        return {
            accessToken,
            refreshToken,
            role,
        };
    }

    async register(data: IRegisterBody) {
        const { username, email, password, fullName, avatar, birth } = data;

        //Kiểm tra user đã tồn tại
        const duplicate = await this.userModel.findOne({ $or: [{ username }, { email }] });

        if (duplicate) {
            const field = duplicate.email === email ? "Email" : "Tên đăng nhập";
            throw new AppError(`${field} đã được sử dụng`, 409);
        }

        //Mặc định role là customer
        const defaultRole = await this.roleModel.findOne({ name: "CUSTOMER", isDeleted: false });
        if (!defaultRole) throw new AppError("Hệ thống chưa cấu hình vai trò mặc định", 500);

        //Lấy hạng thấp nhất
        const defaultMembership = await this.membershipModel.findOne({ isDeleted: false }).sort({ minSpending: 1 });
        if (!defaultMembership) throw new AppError("Hệ thống chưa cấu hình hạng thành viên", 500);

        //Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            avatar,
            birth,
            role: defaultRole._id,
            membership: defaultMembership._id,
            currentPoints: 0,
            totalSpending: 0,
            isBlocked: false
        });
    }

    async login(data: ILoginBody) {
        const { username, password } = data;
        const user = await this.userModel.findOne({ username, isDeleted: false }).select("+password");

        if (!user || !user.password) {
            throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
        }

        // Gọi hàm dùng chung
        const tokens = await this.generateAuthTokens(user);

        return {
            username: user.username,
            avatar: user.avatar,
            ...tokens
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
        if (!refreshToken) throw new AppError("Không tìm thấy refreshToken", 400);

        const session = await this.sessionModel.findOne({ refreshToken });
        if (!session || session.expiresAt < new Date()) {
            throw new AppError("Token không hợp lệ hoặc hết hạn", 404);
        }

        const user = await this.userModel.findById(session.userId).populate("role");
        if (!user) throw new AppError("Người dùng không tồn tại", 404);

        const roleName = (user.role as any)?.name || "CUSTOMER";

        const accessToken = Jwt.sign(
            { userId: user._id, role: roleName },
            ENV.ACCESS_TOKEN_SECRET as string,
            { expiresIn: ENV.ACCESS_TOKEN_TTL as any }
        );

        return { accessToken, role: roleName };
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
        const user = await this.userModel.findById(userId);
        if (!user) throw new AppError("Người dùng không tồn tại", 404);

        // Gọi hàm dùng chung để lấy các token và roleName
        const tokens = await this.generateAuthTokens(user);

        return {
            username: user.username, // Bổ sung thêm username
            ...tokens
        };
    }
}