import type { Brand, Category, ProductLogAction } from "@/enum/enum";

export type ProductResponse = {
  id: number;
  name: string;
  brand: Brand;
  manufacturer: string;
  category: Category;
  price: number;
  cost_price: number;
  stock: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  message?: string;
};

export type ProductPublicResponse = {
  id: number;
  name: string;
  brand: Brand;
  manufacturer: string;
  category: Category;
  image_url?: string;
  price: number;
  stock: number;
};

export type DeleteProductResponse = {
  message: string;
};

export type CreateProductRequest = {
  name: string;
  brand: Brand;
  manufacturer: string;
  price: number;
  cost_price: number;
  category: Category;
  stock: number;
  image?: File;
};

export type ApiResponse<T> = {
  data: T;
  errors?: string;
  paging?: {
    current_page: number;
    total_page: number;
    size: number;
  };
  message?: string;
};

export type SearchProductRequest = {
  name?: string;
  brand?: Brand;
  manufacturer?: string;
  category?: Category;
  min_price?: number;
  max_price?: number;
  in_stock_only?: boolean;
  is_deleted?: boolean;
  page: number;
  size: number;
  sort_by?: "price" | "stock" | "created_at";
  sort_order?: "asc" | "desc";
};

export type DetailedProductRequest = {
  id: number;
};

export type DeleteProductRequest = {
  id: number;
};

export type RestoreProductRequest = {
  id: number;
  name?: string;
};

export type UpdateProductRequest = {
  id: number;
  name?: string;
  brand?: Brand;
  manufacturer?: string;
  price?: number;
  cost_price?: number;
  category?: Category;
  stock?: number;
  image?: File;
  delete_image?: boolean;
  stock_action?: ProductLogAction;
};

export function toProductResponse(product: ProductResponse): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    manufacturer: product.manufacturer,
    category: product.category,
    price: product.price,
    cost_price: product.cost_price,
    stock: product.stock,
    image_url: product.image_url,
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
}

export function toProductPublicResponse(
  product: ProductResponse,
): ProductPublicResponse {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    manufacturer: product.manufacturer,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image_url: product.image_url,
  };
}
