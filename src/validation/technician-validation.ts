import { ACCEPTED_IMAGE_TYPES, MAX_SIGNATURE_SIZE } from "@/types/type";
import z from "zod";

export class TechnicianValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1).max(100),
    signature: z
      .custom<File>((v) => v instanceof File, { message: "Image is required" })
      .refine((file) => file?.size <= MAX_SIGNATURE_SIZE, {
        message: "Max image size is 2MB",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      })
      .optional(),
    is_active: z.preprocess((val) => {
      if (typeof val === "string") return val === "true";
      return Boolean(val);
    }, z.boolean().default(true)),
  });

  static readonly SEARCH = z.object({
    name: z.string().min(1).max(100).optional(),
    is_active: z
      .preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return Boolean(val);
      }, z.boolean().default(true))
      .optional(),
    page: z.coerce.number().min(1).positive().default(1),
    size: z.coerce.number().min(1).max(100).positive().default(10),
    sort_by: z.enum(["created_at", "is_active"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });

  static readonly UPDATE = z.object({
    name: z
      .string()
      .min(1, { message: "Technician name cannot be empty" })
      .max(100, { message: "Technician name cannot exceed 100 characters" })
      .optional(),

    is_active: z
      .preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return Boolean(val);
      }, z.boolean().default(true))
      .optional(),

    signature: z
      .custom<File>((v) => v instanceof File)
      .refine((file) => file?.size <= MAX_SIGNATURE_SIZE, {
        message: "Max image size is 2MB",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      })
      .optional(),

    delete_image: z.preprocess(
      (val) => val === "true" || val === true,
      z.boolean().optional(),
    ),
  });
}
