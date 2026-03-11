import type { ProductLogAction, UserRole } from "@/enum/enum";

export type ProductLogResponse = {
  id: number;
  product_id: number;
  action: ProductLogAction;
  quantity_change: number;
  description: string;
  total_revenue: number;
  total_profit: number;
  is_voided: boolean;
  created_at: Date;
  user: {
    username: string;
    role: UserRole;
  };
};

export type GetLogRequest = {
  id: number;
};

export function toProductLogResponse(
  data: ProductLogResponse,
): ProductLogResponse {
  return {
    id: data.id,
    product_id: data.product_id,
    action: data.action,
    quantity_change: data.quantity_change,
    description: data.description,
    total_revenue: data.total_revenue,
    total_profit: data.total_profit,
    created_at: data.created_at,
    is_voided: data.is_voided,
    user: {
      username: data.user.username,
      role: data.user.role,
    },
  };
}
