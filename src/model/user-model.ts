export type UserResponse = {
  username: string;
  email: string;
  name: string;
  role: string;
  token?: string | null;
  google_id?: string | null;
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  name: string;
};

export type GoogleLoginRequest = {
  token: string;
};

export type ApiResponse<T> = {
  data: T;
  errors?: string;
  paging?: {
    current_page: number;
    total_page: number;
    size: number;
  };
};

export type ResendVerificationResponse = {
  email: string;
  message: string;
};

export type ForgotPasswordRequest = {
  identifier: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
  confirm_new_password: string;
};

export type ForgotPasswordResponse = {
  email: string;
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export function toUserResponse(data: UserResponse): UserResponse {
  return {
    username: data.username,
    name: data.name,
    email: data.email,
    role: data.role,
    token: data.token,
  };
}

export function toGoogleUserResponse(data: UserResponse): UserResponse {
  return {
    ...toUserResponse(data),
    google_id: data.google_id,
  };
}

export function toUserResponseWithToken(data: UserResponse): UserResponse {
  return {
    ...toUserResponse(data),
    google_id: data.google_id,
    token: data.token,
  };
}

export function toResendVerificationResponse(data: ResendVerificationResponse) {
  return {
    email: data.email,
    message: data.message,
  };
}

export function toForgotPasswordResponse(data: ForgotPasswordResponse) {
  return {
    email: data.email,
    message: data.message,
  };
}

export function toResetPasswordResponse(data: ResetPasswordResponse) {
  return {
    message: data.message,
  };
}
