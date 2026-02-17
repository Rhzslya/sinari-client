import type { ServiceLogAction, UserRole } from "@/enum/product-enum";

export type ServiceLogResponse = {
  id: number;
  service_id: number;
  action: ServiceLogAction;
  description: string;
  created_at: Date;
  user: {
    username: string;
    role: UserRole;
  };
};

export type GetLogRequest = {
  id: number;
};

export function toServiceLogResponse(
  data: ServiceLogResponse,
): ServiceLogResponse {
  return {
    id: data.id,
    service_id: data.service_id,
    action: data.action,
    description: data.description,
    created_at: data.created_at,
    user: {
      username: data.user.username,
      role: data.user.role,
    },
  };
}
