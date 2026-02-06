import { UserRole } from "@/enum/product-enum";
import z from "zod";

const ROLE_VALUES = Object.values(UserRole) as [UserRole, ...UserRole[]];

export class UserValidation {
  static readonly LOGIN = z.object({
    identifier: z
      .string()
      .min(1, "Username or Email is required")
      .superRefine((val, ctx) => {
        if (val.includes("@")) {
          const isEmailValid = z.email().safeParse(val).success;

          if (!isEmailValid) {
            ctx.addIssue({
              code: "custom",
              message: "Invalid email address",
            });
          }
          return;
        }

        if (val.length < 3) {
          ctx.addIssue({
            code: "custom",
            message: "Username must be at least 3 characters",
          });
        }
      }),
    password: z.string().min(8, "Password is required"),
  });

  static readonly REGISTER = z.object({
    email: z.email().min(1, "Email is required").max(100, "Email is too long"),
    username: z
      .string()
      .min(3, "Username Minimum 3 Characters")
      .max(100, "Username is too long")
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
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  });

  static readonly SEARCH = z.object({
    username: z.string().min(3).max(100).optional(),
    name: z.string().min(1).max(100).optional(),
    page: z.coerce.number().min(1).positive().default(1),
    size: z.coerce.number().min(1).max(100).positive().default(10),
    sort_by: z.enum(["created_at", "name"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
    is_online: z
      .string()
      .transform((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
      })
      .optional(),
    role: z.enum(ROLE_VALUES).optional(),
  });

  static readonly UPDATE = z.object({
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(100)
      .optional(),
    email: z.email({ message: "Invalid email address" }).optional(),
  });

  static readonly UPDATE_ROLE = z.object({
    role: z.enum(ROLE_VALUES, {
      message: "Select a valid role",
    }),
  });

  static readonly FORGOT_PASSWORD = z.object({
    identifier: z
      .string()
      .min(1, "Username or Email is required")
      .superRefine((val, ctx) => {
        if (val.includes("@")) {
          const isEmailValid = z.email().safeParse(val).success;

          if (!isEmailValid) {
            ctx.addIssue({
              code: "custom",
              message: "Invalid email address",
            });
          }
          return;
        }

        if (val.length < 3) {
          ctx.addIssue({
            code: "custom",
            message: "Username must be at least 3 characters",
          });
        }
      }),
  });

  static readonly GOOGLE_LOGIN = z.object({
    token: z.string().min(1, "Token is required"),
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
