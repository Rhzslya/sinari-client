import { api } from "@/lib/axios";
import {
  toUserResponse,
  type ApiResponse,
  type LoginRequest,
  type RegisterRequest,
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

  static async verify(token: string): Promise<boolean> {
    await api.get(`/auth/verify?token=${token}`);
    return true;
  }

  static async resendVerification(identifier: string): Promise<string> {
    const isEmail = identifier.includes("@");

    const paramKey = isEmail ? "email" : "username";

    const response = await api.get(
      `/auth/resend-verify?${paramKey}=${identifier}`,
    );

    return response.data.data.email;
  }
}
