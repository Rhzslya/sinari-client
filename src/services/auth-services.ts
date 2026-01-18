import { api } from "@/lib/axios";
import {
  toLoginResponse,
  type LoginRequest,
  type LoginResponse,
} from "@/model/auth-model";
import { AuthValidation } from "@/validation/auth-validation";
import { Validation } from "@/validation/validation";

export class AuthServices {
  static async login(request: LoginRequest): Promise<LoginResponse> {
    const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

    const isEmail = loginRequest.identifier.includes("@");

    const payload = {
      email: isEmail ? loginRequest.identifier : undefined,
      username: !isEmail ? loginRequest.identifier : undefined,

      password: loginRequest.password,
    };

    const response = await api.post("/users/login", payload);

    return toLoginResponse(response.data.data);
  }
}
