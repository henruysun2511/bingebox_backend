import { CookieOptions, Request, Response } from "express";
import { ENV } from "../../shares/constants/enviroment";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { AuthService } from "./auth.service";


/* ===================== REGISTER ===================== */
export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return success(res, user, "Đăng ký thành công", 201);
});


const authService = new AuthService();
const isProd = ENV.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, accessToken, refreshToken, role } =
    await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: ENV.REFRESH_TOKEN_TTL,
  });

  // res.cookie("accessToken", accessToken, {
  //   ...cookieOptions,
  //   maxAge: ENV.ACCESS_TOKEN_TTL,
  // });

  return success(res, { username, accessToken, role }, "Đăng nhập thành công", 200);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  return success(res, null, "Đăng xuất thành công", 200);
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      messages: ["Vui lòng đăng nhập"],
    });
  }

  const result = await authService.refreshToken(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: ENV.ACCESS_TOKEN_TTL,
  });

  return success(res, result, "Refresh token thành công");
});


/* ===================== GOOGLE CALLBACK ===================== */
export const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } =
    await authService.googleLogin(req.user!._id.toString());

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: ENV.REFRESH_TOKEN_TTL,
  });

  // res.cookie("accessToken", accessToken, {
  //   ...cookieOptions,
  //   maxAge: ENV.ACCESS_TOKEN_TTL,
  // });

  // ❌ KHÔNG truyền token qua query string
  // ✅ Cookie là đủ
  res.redirect(`${ENV.CLIENT_URL}/oauth-success`);
});


export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  return success(res, null, "OTP đã được gửi về email");
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  return success(res, null, "Đặt lại mật khẩu thành công");
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  await authService.changePassword(req.body, req.user!._id.toString());
  return success(res, null, "Đổi mật khẩu thành công");
});
