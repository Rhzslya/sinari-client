import type { ProductResponse } from "@/model/product-model";

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
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export interface DashboardProductTableProps {
  products: ProductResponse[];
  isLoading: boolean;
}

export interface JwtPayload {
  role: string;
  exp: number;
}

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
