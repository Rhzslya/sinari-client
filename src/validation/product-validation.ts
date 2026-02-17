import { Brand, Category, ProductLogAction } from "@/enum/product-enum";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/types/type";
import { z } from "zod";

const BRAND_VALUES = Object.values(Brand) as [Brand, ...Brand[]];
const CATEGORY_VALUES = Object.values(Category) as [Category, ...Category[]];
const STOCK_ACTION_VALUES = Object.values(ProductLogAction) as [
  ProductLogAction,
  ...ProductLogAction[],
];

export class ProductValidation {
  static readonly CREATE = z
    .object({
      name: z
        .string()
        .min(1, { message: "Product name is required" })
        .max(100, { message: "Product name cannot exceed 100 characters" }),

      brand: z.enum(BRAND_VALUES, {
        message: "Please select a valid brand",
      }),

      manufacturer: z
        .string()
        .min(1, { message: "Manufacturer is required" })
        .max(100, { message: "Manufacturer cannot exceed 100 characters" }),

      price: z.coerce
        .number({ message: "Price must be a number" })
        .min(0, { message: "Price cannot be negative" }),

      cost_price: z.coerce
        .number({ message: "Cost price must be a number" })
        .min(0, { message: "Cost price cannot be negative" }),

      category: z.enum(CATEGORY_VALUES, {
        message: "Please select a valid category",
      }),

      stock: z.coerce
        .number({ message: "Stock must be a number" })
        .min(0, { message: "Stock cannot be negative" })
        .default(0),

      image: z
        .custom<File>((v) => v instanceof File, {
          message: "Image is required",
        })
        .refine((file) => file?.size <= MAX_FILE_SIZE, {
          message: "Max image size is 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        })
        .optional(),
    })
    .refine((data) => data.cost_price <= data.price, {
      message: "Must be \u2264 selling price",
      path: ["cost_price"],
    });

  static readonly SEARCH = z.object({
    name: z.string().optional(),
    manufacturer: z.string().optional(),
    brand: z.enum(BRAND_VALUES).optional(),
    category: z.enum(CATEGORY_VALUES).optional(),
    min_price: z.coerce.number().min(0).optional(),
    max_price: z.coerce.number().min(0).optional(),
    in_stock_only: z.coerce.boolean().optional(),
    is_deleted: z.preprocess((val) => {
      if (typeof val === "string") return val === "true";
      return Boolean(val);
    }, z.boolean().optional()),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(100).default(10),
    sort_by: z.enum(["price", "stock", "created_at"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });

  static readonly UPDATE = z
    .object({
      name: z
        .string()
        .min(1, { message: "Product name cannot be empty" })
        .max(100, { message: "Product name cannot exceed 100 characters" })
        .optional(),

      brand: z
        .enum(BRAND_VALUES, {
          message: "Please select a valid brand",
        })
        .optional(),

      manufacturer: z
        .string()
        .min(1, { message: "Manufacturer cannot be empty" })
        .max(100, { message: "Manufacturer cannot exceed 100 characters" })
        .optional(),

      price: z.coerce
        .number({ message: "Price must be a number" })
        .min(0, { message: "Price cannot be negative" })
        .optional(),

      cost_price: z.coerce
        .number({ message: "Cost price must be a number" })
        .min(0, { message: "Cost price cannot be negative" })
        .optional(),

      category: z
        .enum(CATEGORY_VALUES, {
          message: "Please select a valid category",
        })
        .optional(),

      stock: z.coerce
        .number({ message: "Stock must be a number" })
        .min(0, { message: "Stock cannot be negative" })
        .optional(),

      image: z
        .custom<File>((v) => v instanceof File)
        .refine((file) => file?.size <= MAX_FILE_SIZE, {
          message: "Max image size is 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        })
        .optional(),

      delete_image: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean().optional(),
      ),

      stock_action: z.enum(STOCK_ACTION_VALUES).optional(),
    })
    .refine(
      (data) => {
        if (data.cost_price !== undefined && data.price !== undefined) {
          return data.cost_price <= data.price;
        }
        return true;
      },
      {
        message: "Must be \u2264 selling price",
        path: ["cost_price"],
      },
    );

  static readonly UPDATE_STOCK = z.object({
    stock: z.coerce
      .number({ message: "Stock must be a number" })
      .min(0, { message: "Stock cannot be negative" }),
    stock_action: z.enum(STOCK_ACTION_VALUES).optional(),
  });
}

export type UpdateStockFormValues = z.infer<
  typeof ProductValidation.UPDATE_STOCK
>;
