export type ContactUsRequest = {
  name: string;
  email: string;
  subject: string;
  phone_number?: string;
  message: string;
};

export type VerificationMailRequest = {
  email: string;
  name: string;
  token: string;
};

export type PasswordResetMailRequest = {
  email: string;
  name: string;
  token: string;
};

export type UserNotificationRequest = {
  email: string;
  name: string;
};

export type ContactUsResponse = {
  message: string;
};

export type ApiResponse<T> = {
  data: T;
  errors?: string;
  message?: string;
};
