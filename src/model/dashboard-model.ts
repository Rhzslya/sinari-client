export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type DashboardStatsResponse = {
  cards: {
    total_revenue: number;
    revenue_growth: number;
    profit: number;
    profit_growth: number;
    active_services: number;
    pending_queue: number;
    finished_jobs: number;
    products_sold: number;
  };
  chart_data: {
    name: string;
    total: number;
  }[];
  recent_activity: DashboardActivityLog[];
};

export type DashboardActivityLog = {
  id: number;
  type: "SERVICE" | "PRODUCT";
  username: string;
  action: string;
  description: string;
  time: string;
  is_deleted: boolean;

  service_id?: string;
  service_pk?: number;
  customer_name?: string;

  product_pk?: number;
  product_name?: string;
};
