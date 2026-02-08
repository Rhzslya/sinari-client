import type { UserRole } from "@/enum/product-enum";

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string | null;
  google_id?: string | null;
};

export type NotPublicUserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  google_id?: string | null;
  is_online?: boolean;
  created_at: Date;
  updated_at?: Date;
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

export type SearchUserRequest = {
  username?: string;
  name?: string;
  page: number;
  size: number;
  sort_by?: "created_at" | "name";
  sort_order?: "asc" | "desc";
  is_online?: boolean;
  role?: UserRole;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
};

export type UpdateRoleRequest = {
  id: number;
  role: UserRole;
};

export type GetDetailedUserRequest = {
  id: number;
};

export type DetailedUserResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  google_id: string | null;

  created_at: string;
  updated_at: string;

  verify_expires_at: string | null;
  resend_count: number;
  last_resend_time: string | null;

  password_reset_expires_at: string | null;
  pass_reset_count: number;
  pass_reset_last_time: string | null;
  is_online?: boolean;
};

export type DeleteUserRequest = {
  id: number;
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

export type DeleteUserResponse = {
  message: string;
};

export function toUserResponse(data: UserResponse): UserResponse {
  return {
    id: data.id,
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

export function toNotPublicUserResponse(
  data: NotPublicUserResponse,
): NotPublicUserResponse {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    name: data.name,
    role: data.role,
    google_id: data.google_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_online: data.is_online,
  };
}

export function toDetailedUserResponse(
  user: DetailedUserResponse,
): DetailedUserResponse {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role as UserRole,
    is_verified: user.is_verified,
    google_id: user.google_id,
    created_at: user.created_at,
    updated_at: user.updated_at,
    verify_expires_at: user.verify_expires_at || null,
    resend_count: user.resend_count,
    last_resend_time: user.last_resend_time || null,
    password_reset_expires_at: user.password_reset_expires_at || null,
    pass_reset_count: user.pass_reset_count,
    pass_reset_last_time: user.pass_reset_last_time || null,
    is_online: user.is_online ?? false,
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

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 2) {
    return `${localPart}*****@${domain}`;
  }

  const maskedLocal = localPart.substring(0, 3) + "*".repeat(5);

  return `${maskedLocal}@${domain}`;
}
