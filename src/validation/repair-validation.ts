import { Brand, ServiceStatus } from "@/enum/product-enum";
import { z } from "zod";

const BRAND_VALUES = Object.values(Brand) as [Brand, ...Brand[]];
const SERVICE_STATUS_VALUES = Object.values(ServiceStatus) as [
  string,
  ...string[],
];
const INDONESIAN_PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

export class RepairValidation {
  static readonly CREATE = z.object({
    brand: z.enum(BRAND_VALUES, {
      message: "Please select a valid brand",
    }),

    model: z
      .string()
      .min(1, { message: "Model is required" })
      .max(100, { message: "Model cannot exceed 100 characters" }),

    customer_name: z
      .string()
      .min(1, { message: "Customer name is required" })
      .max(100, { message: "Customer name cannot exceed 100 characters" }),

    phone_number: z
      .string()
      .min(9, { message: "Min 9 digits" })
      .max(15, { message: "Max 15 digits" })
      .regex(INDONESIAN_PHONE_REGEX, {
        message: "Wrong Format",
      }),

    description: z
      .string()
      .max(100, { message: "Description cannot exceed 100 characters" })
      .optional(),

    technician_note: z
      .string()
      .max(100, { message: "Technician note cannot exceed 100 characters" })
      .optional(),

    service_list: z
      .array(
        z.object({
          name: z
            .string()
            .min(1, { message: "Service name is required" })
            .max(100, { message: "Service name cannot exceed 100 characters" }),
          price: z.coerce
            .number({ message: "Price must be a number" })
            .min(1000, { message: "Price must be at least 1000" })
            .positive({ message: "Price must be positive" }),
        }),
      )
      .min(1, { message: "At least one service is required" }),

    discount: z.coerce
      .number({ message: "Discount must be a number" })
      .min(0, { message: "Discount cannot be less than 0%" })
      .max(100, { message: "Discount cannot be more than 100%" })
      .optional()
      .default(0),

    down_payment: z.coerce
      .number({ message: "Down Payment must be a number" })
      .min(0, { message: "Down Payment cannot be less than 0" })
      .optional()
      .default(0),
  });

  static readonly UPDATE = z.object({
    customer_name: z
      .string()
      .min(1, { message: "Customer name is required" })
      .max(100, { message: "Customer name cannot exceed 100 characters" })
      .optional(),

    phone_number: z
      .string()
      .min(9, { message: "Min 9 digits" })
      .max(15, { message: "Max 15 digits" })
      .regex(INDONESIAN_PHONE_REGEX, {
        message: "Wrong Format",
      })
      .optional(),

    model: z
      .string()
      .min(1, { message: "Model is required" })
      .max(100, { message: "Model cannot exceed 100 characters" })
      .optional(),

    status: z
      .enum(SERVICE_STATUS_VALUES, {
        message: "Please select a valid status",
      })
      .optional(),

    description: z
      .string()
      .max(100, { message: "Description cannot exceed 100 characters" })
      .optional(),

    technician_note: z
      .string()
      .max(100, { message: "Technician note cannot exceed 100 characters" })
      .optional(),

    service_list: z
      .array(
        z.object({
          name: z
            .string()
            .min(1, { message: "Service name is required" })
            .max(100, { message: "Service name cannot exceed 100 characters" }),
          price: z.coerce
            .number({ message: "Price must be a number" })
            .min(1000, { message: "Price must be at least 1000" })
            .positive({ message: "Price must be positive" }),
        }),
      )
      .min(1, { message: "At least one service is required" })
      .optional(),

    discount: z.coerce
      .number({ message: "Discount must be a number" })
      .min(0, { message: "Discount cannot be less than 0%" })
      .max(100, { message: "Discount cannot be more than 100%" })
      .optional(),

    down_payment: z.coerce
      .number({ message: "Down Payment must be a number" })
      .min(0, { message: "Down Payment cannot be less than 0" })
      .optional(),

    brand: z
      .enum(BRAND_VALUES, {
        message: "Please select a valid brand",
      })
      .optional(),
  });

  static readonly SEARCH = z.object({
    servive_id: z.string().min(1).max(100).optional(),
    brand: z.enum(BRAND_VALUES).optional(),
    model: z.string().min(1).max(100).optional(),
    customer_name: z.string().min(1).max(100).optional(),
    phone_number: z.string().min(1).max(100).optional(),
    min_price: z.coerce.number().min(0).optional(),
    max_price: z.coerce.number().min(0).optional(),
    status: z.enum(SERVICE_STATUS_VALUES).optional(),
    page: z.coerce.number().min(1).positive().default(1),
    size: z.coerce.number().min(1).max(100).positive().default(10),
    sort_by: z.enum(["total_price", "created_at", "updated_at"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });
}
