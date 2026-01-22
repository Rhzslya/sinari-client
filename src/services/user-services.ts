import { api } from "@/lib/axios";
import {
  toForgotPasswordResponse,
  toResendVerificationResponse,
  toResetPasswordResponse,
  toUserResponse,
  type ApiResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type GoogleLoginRequest,
  type LoginRequest,
  type RegisterRequest,
  type ResendVerificationResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type UserResponse,
} from "@/model/user-model";
import { UserValidation } from "@/validation/user-validation";
import { Validation } from "@/validation/validation";

export class AuthServices {
  static async login(request: LoginRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const isEmail = loginRequest.identifier.includes("@");

    const payload = {
      email: isEmail ? loginRequest.identifier : undefined,
      username: !isEmail ? loginRequest.identifier : undefined,
      password: loginRequest.password,
    };

    const response = await api.post<ApiResponse<UserResponse>>(
      "/auth/login",
      payload,
    );
    return toUserResponse(response.data.data);
  }

  static async googleLogin(request: GoogleLoginRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(
      UserValidation.GOOGLE_LOGIN,
      request,
    );

    const response = await api.post<ApiResponse<UserResponse>>(
      "/auth/google",
      loginRequest,
    );

    return toUserResponse(response.data.data);
  }

  static async register(request: RegisterRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request,
    );

    const payload = {
      email: registerRequest.email,
      username: registerRequest.username,
      password: registerRequest.password,
      name: registerRequest.name,
    };

    const response = await api.post<ApiResponse<UserResponse>>(
      "/users",
      payload,
    );
    return toUserResponse(response.data.data);
  }

  static async logout(): Promise<boolean> {
    try {
      await api.delete("/users/logout");

      return true;
    } catch (error) {
      console.warn("Failed to Request Logout, but it's not a problem", error);

      return true;
    }
  }

  static async verify(token: string): Promise<boolean> {
    await api.get(`/auth/verify?token=${token}`);
    return true;
  }

  static async resendVerification(
    identifier: string,
  ): Promise<ResendVerificationResponse> {
    const isEmail = identifier.includes("@");

    const paramKey = isEmail ? "email" : "username";

    const response = await api.get<ApiResponse<ResendVerificationResponse>>(
      `/auth/resend-verify?${paramKey}=${identifier}`,
    );

    return toResendVerificationResponse(response.data.data);
  }

  static async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const forgotPasswordRequest = Validation.validate(
      UserValidation.FORGOT_PASSWORD,
      request,
    );

    const payload = {
      identifier: forgotPasswordRequest.identifier,
    };

    const response = await api.post<ApiResponse<ForgotPasswordResponse>>(
      "/auth/forgot-password",
      payload,
    );

    return toForgotPasswordResponse(response.data.data);
  }

  static async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const resetPasswordRequest = Validation.validate(
      UserValidation.RESET_PASSWORD,
      request,
    );

    const payload = {
      token: resetPasswordRequest.token,
      new_password: resetPasswordRequest.new_password,
      confirm_new_password: resetPasswordRequest.confirm_new_password,
    };

    const response = await api.patch<ApiResponse<ResetPasswordResponse>>(
      "/auth/reset-password",
      payload,
    );

    return toResetPasswordResponse(response.data.data);
  }
}
