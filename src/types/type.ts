import type { ProductResponse } from "@/model/product-model";
import type { ServiceResponse } from "@/model/repair-model";
import type { TechnicianResponse } from "@/model/technician-model";
import type { NotPublicUserResponse, UserResponse } from "@/model/user-model";

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export interface NumberStepperProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

export interface DashboardProductTableProps {
  products: ProductResponse[];
  isLoading: boolean;
  onRefresh?: () => void;
  onSuccess?: () => void;
  isTrashView?: boolean;
}

export interface DashboardServiceTableProps {
  services: ServiceResponse[];
  isLoading: boolean;
  onRefresh?: () => void;
  onSuccess?: () => void;
  isTrashView?: boolean;
}

export interface DashboardTechnicianTableProps {
  technicians: TechnicianResponse[];
  isLoading: boolean;
  onRefresh?: () => void;
  onSuccess?: () => void;
  isTrashView?: boolean;
}

export interface DashboardUserTableProps {
  users: NotPublicUserResponse[];
  isLoading: boolean;
  onRefresh?: () => void;
  onSuccess?: () => void;
}

export interface ExtendedTableProps extends DashboardUserTableProps {
  currentUser: UserResponse | undefined;
  currentUserId?: number;
  isCurrentUserOwner: boolean;
  isTrashView?: boolean;
}

export interface JwtPayload {
  role: string;
  exp: number;
}

export const MAX_FILE_SIZE = 5000000;
export const MAX_SIGNATURE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type WhatsappSendResult = {
  success: boolean;
  error?: string;
};
