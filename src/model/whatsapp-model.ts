export type WhatsappConnectionStatus =
  | "connected"
  | "loading_qr"
  | "disconnected";

export type WhatsappStatusResponse = {
  status: WhatsappConnectionStatus;
  qr_code?: string | null;
};

export type WhatsappDisconnectResponse = {
  success: boolean;
  message: string;
};

export type WhatsappSendResult = {
  success: boolean;
  error?: string;
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
