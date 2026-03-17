import { api } from "@/lib/axios";
import {
  toForgotPasswordResponse,
  toNotPublicUserResponse,
  toResendVerificationResponse,
  toResetPasswordResponse,
  toUserResponse,
  type ApiResponse,
  type DeleteUserResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type GoogleLoginRequest,
  type NotPublicUserResponse,
  type ResendVerificationResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type SearchUserRequest,
  type UpdateRoleRequest,
  type UserResponse,
  type GetDetailedUserRequest,
  type DetailedUserResponse,
  toDetailedUserResponse,
  type RestoreUserRequest,
  type RegisterUserRequest,
  type LoginUserRequest,
  type DeleteUserRequest,
  type VerifyUserRequest,
  type ResendVerificationRequest,
  type ChangePasswordRequest,
  type ChangePasswordResponse,
  toChangePasswordResponse,
  type OtpLoginResponse,
  type OtpLoginRequest,
  type ResendOtpRequest,
  type ResendOtpResponse,
  toResendOtpResponse,
} from "@/model/user-model";
import { UserValidation } from "@/validation/user-validation";
import { Validation } from "@/validation/validation";
import axios from "axios";

export class AuthServices {
  static async login(request: LoginUserRequest): Promise<OtpLoginResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const payload = {
      identifier: loginRequest.identifier,
      password: loginRequest.password,
    };

    const response = await api.post<ApiResponse<OtpLoginResponse>>(
      "/auth/login",
      payload,
    );

    return response.data.data;
  }

  static async verifyOtp(request: OtpLoginRequest): Promise<UserResponse> {
    const verifyRequest = Validation.validate(
      UserValidation.VERIFY_OTP,
      request,
    );

    const response = await api.post<ApiResponse<UserResponse>>(
      "/auth/verify-otp",
      verifyRequest,
    );

    return toUserResponse(response.data.data);
  }

  static async resendOtp(
    request: ResendOtpRequest,
  ): Promise<ResendOtpResponse> {
    const resendRequest = Validation.validate(
      UserValidation.RESEND_OTP,
      request,
    );

    const response = await api.post<ApiResponse<ResendOtpResponse>>(
      "/auth/resend-otp",
      resendRequest,
    );

    return toResendOtpResponse(response.data.data);
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

  static async register(request: RegisterUserRequest): Promise<UserResponse> {
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

  static async search(
    request: SearchUserRequest,
  ): Promise<ApiResponse<NotPublicUserResponse[]>> {
    const response = await api.get<
      ApiResponse<ApiResponse<NotPublicUserResponse[]>>
    >("/users", {
      params: request,
    });

    return response.data.data;
  }

  static async get(): Promise<UserResponse> {
    const response = await api.get<ApiResponse<UserResponse>>("/users/current");

    return toUserResponse(response.data.data);
  }

  static async getById(
    request: GetDetailedUserRequest,
  ): Promise<DetailedUserResponse> {
    const response = await api.get<ApiResponse<DetailedUserResponse>>(
      `/users/${request.id}`,
    );

    return toDetailedUserResponse(response.data.data);
  }

  static async updateRole(
    request: UpdateRoleRequest,
  ): Promise<NotPublicUserResponse> {
    const updateRoleRequest = Validation.validate(
      UserValidation.UPDATE_ROLE,
      request,
    );

    const response = await api.patch<ApiResponse<NotPublicUserResponse>>(
      `/users/${request.id}`,
      updateRoleRequest,
    );

    return toNotPublicUserResponse(response.data.data);
  }

  static async logout(): Promise<boolean> {
    try {
      await api.delete("/users/logout");

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return true;
        }
      }

      return true;
    }
  }

  static async remove(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid user ID");
    }

    const response = await api.delete<ApiResponse<boolean>>(
      `/users/${request.id}`,
      {
        skipGlobalErrorHandler: true,
      },
    );

    return {
      message: response.data.message || "User deleted successfully",
    };
  }

  static async restore(
    request: RestoreUserRequest,
  ): Promise<NotPublicUserResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid user ID");
    }

    const response = await api.patch<ApiResponse<NotPublicUserResponse>>(
      `/users/${request.id}/restore`,
    );

    return toNotPublicUserResponse(response.data.data);
  }

  static async verify(request: VerifyUserRequest): Promise<boolean> {
    await api.get<ApiResponse<boolean>>(`/auth/verify?token=${request.token}`);
    return true;
  }

  static async resendVerification(
    request: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> {
    const isEmail = request.identifier.includes("@");

    const paramKey = isEmail ? "email" : "username";

    const response = await api.get<ApiResponse<ResendVerificationResponse>>(
      `/auth/resend-verify?${paramKey}=${request.identifier}`,
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

  static async changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const changePasswordRequest = Validation.validate(
      UserValidation.CHANGE_PASSWORD,
      request,
    );

    const payload = {
      old_password: changePasswordRequest.old_password,
      new_password: changePasswordRequest.new_password,
      confirm_new_password: changePasswordRequest.confirm_new_password,
    };

    const response = await api.patch<ApiResponse<ChangePasswordResponse>>(
      "/users/change-password",
      payload,
    );

    return toChangePasswordResponse(response.data.data);
  }
}
