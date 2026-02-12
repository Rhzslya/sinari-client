export type ServiceLogResponse = {
  id: number;
  service_id: number;
  action: string;
  description: string;
  created_at: Date;
  user: {
    name: string;
    role: string;
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
      name: data.user.name,
      role: data.user.role,
    },
  };
}
