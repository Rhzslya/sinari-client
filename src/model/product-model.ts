import type { Brand, Category } from "@/enum/product-enum";

export type ProductResponse = {
  id: number;
  name: string;
  brand: Brand;
  manufacturer: string;
  category: Category;
  price: number;
  cost_price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
};

export type CreateProductRequest = {
  name: string;
  brand: Brand;
  manufacturer: string;
  price: number;
  cost_price: number;
  category: Category;
  stock: number;
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

export type SearchProductRequest = {
  name?: string;
  brand?: Brand;
  manufacturer?: string;
  category?: Category;
  min_price?: number;
  max_price?: number;
  in_stock_only?: boolean;
  page: number;
  size: number;
  sort_by?: "price" | "stock" | "created_at";
  sort_order?: "asc" | "desc";
};

export function toProductResponse(data: ProductResponse): ProductResponse {
  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    manufacturer: data.manufacturer,
    category: data.category,
    price: data.price,
    cost_price: data.cost_price,
    stock: data.stock,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
