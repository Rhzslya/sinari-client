import z from "zod";

export class UserValidation {
  static readonly LOGIN = z.object({
    identifier: z.string().min(1, "Username or Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  static readonly REGISTER = z.object({
    email: z.email().min(1, "Email is required"),
    username: z
      .string()
      .min(3, "Username Minimum 3 Characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must contain only letters, numbers and underscores",
      ),
    password: z
      .string()
      .min(8, "Password Minimum 8 Characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character",
      ),
    name: z.string().min(1, "Name is required"),
  });

  static readonly FORGOT_PASSWORD = z.object({
    identifier: z.string().min(1, "Username or Email is required"),
  });

  static readonly RESET_PASSWORD = z
    .object({
      token: z.string().min(1, "Token is required"),
      new_password: z
        .string()
        .min(8, "Password Minimum 8 Characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /(?=.*[!@#$%^&*])/,
          "Password must contain at least one special character",
        ),
      confirm_new_password: z
        .string()
        .min(8, "Confirmation password is required"),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
      message: "Passwords do not match",
      path: ["confirm_new_password"],
    });
}
