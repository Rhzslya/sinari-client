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

export type ApiResponse<T> = {
  data: T;
  errors?: string;
  paging?: {
    current_page: number;
    total_page: number;
    size: number;
  };
};

export function toUserResponse(data: UserResponse): UserResponse {
  return {
    username: data.username,
    name: data.name,
    email: data.email,
    role: data.role,
  };
}

export function toUserResponseWithToken(data: UserResponse): UserResponse {
  return {
    ...toUserResponse(data),
    google_id: data.google_id,
    token: data.token,
  };
}
