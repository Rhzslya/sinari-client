export type LoginRequest = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  username: string;
  name: string;
};

export function toLoginResponse(data: LoginResponse): LoginResponse {
  return {
    token: data.token,
    username: data.username,
    name: data.name,
  };
}
