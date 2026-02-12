export type TechnicianResponse = {
  id: number;
  name: string;
  signature_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ListTechnicianResponse = {
  id: number;
  name: string;
};

export type Technician = {
  id: number;
  name: string;
  signature_url?: string | null;
  is_active: boolean;
};

export type PublicTechnicianResponse = {
  name: string;
  signature_url?: string;
};

export type DeleteTechnicianResponse = {
  message: string;
};

export type CreateTechnicianRequest = {
  name: string;
  signature?: File;
  is_active?: boolean;
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

export type SearchTechnicianRequest = {
  name?: string;
  page: number;
  size: number;
  is_active?: boolean;
  sort_by?: "created_at" | "is_active" | "name";
  sort_order?: "asc" | "desc";
};

export type UpdateTechnicianRequest = {
  id: number;
  name?: string;
  signature?: File;
  delete_image?: boolean;
  is_active?: boolean;
};

export type DeleteTechnicianRequest = {
  id: number;
};

export function toTechnicianResponse(
  technician: TechnicianResponse,
): TechnicianResponse {
  return {
    id: technician.id,
    name: technician.name,
    signature_url: technician.signature_url,
    is_active: technician.is_active,
    created_at: technician.created_at,
    updated_at: technician.updated_at,
  };
}

export function toListTechnicianResponse(
  technician: ListTechnicianResponse,
): ListTechnicianResponse {
  return {
    id: technician.id,
    name: technician.name,
  };
}
