import { Brand, Category } from "@/enum/product-enum";
import { z } from "zod";

const BRAND_VALUES = Object.values(Brand) as [Brand, ...Brand[]];
const CATEGORY_VALUES = Object.values(Category) as [Category, ...Category[]];

export class ProductValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1, { message: "Product name is required" }),

    brand: z.enum(BRAND_VALUES, {
      message: "Please select a valid brand",
    }),

    manufacturer: z.string().min(1, { message: "Manufacturer is required" }),

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
      .min(0, { message: "Stock cannot be negative" }),
  });

  static readonly SEARCH = z.object({
    name: z.string().optional(),
    manufacturer: z.string().optional(),
    brand: z.enum(BRAND_VALUES).optional(),
    category: z.enum(CATEGORY_VALUES).optional(),
    min_price: z.coerce.number().min(0).optional(),
    max_price: z.coerce.number().min(0).optional(),
    in_stock_only: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(100).default(10),
    sort_by: z.enum(["price", "stock", "created_at"]).optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });
}
