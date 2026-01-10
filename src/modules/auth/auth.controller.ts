import { Request, Response } from "express";
import { ENV } from "../../shares/constants/enviroment";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return success(res, user, "Đăng ký thành công", 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ENV.REFRESH_TOKEN_TTL,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: Number(ENV.ACCESS_TOKEN_TTL),
  });

  return success(res, { username, accessToken }, "Đăng nhập thành công", 200);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(refreshToken);

  return success(res, null, "Đăng xuất thành công", 200);
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies.refreshToken;

  const result = await authService.refreshToken(refreshToken);
  return success(res, result, "Refresh token thành công");
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

export const googleCallback = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.googleLogin(req.user!._id.toString());

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ENV.REFRESH_TOKEN_TTL,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: Number(ENV.ACCESS_TOKEN_TTL),
  });

  // Redirect về frontend
  res.redirect(
    `${ENV.CLIENT_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};