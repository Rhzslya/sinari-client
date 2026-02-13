export const UserRole = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Brand = {
  APPLE: "APPLE",
  SAMSUNG: "SAMSUNG",
  XIAOMI: "XIAOMI",
  OPPO: "OPPO",
  VIVO: "VIVO",
  REALME: "REALME",
  INFINIX: "INFINIX",
  TECNO: "TECNO",
  ITEL: "ITEL",
  ASUS: "ASUS",
  HUAWEI: "HUAWEI",
  SONY: "SONY",
  GOOGLE: "GOOGLE",
  NOKIA: "NOKIA",
  LENOVO: "LENOVO",
  UNIVERSAL: "UNIVERSAL",
  OTHER: "OTHER",
} as const;

export type Brand = (typeof Brand)[keyof typeof Brand];

export const Category = {
  LCD: "LCD",
  BATTERY: "BATTERY",
  CONNECTOR: "CONNECTOR",
  FLEXIBLE: "FLEXIBLE",
  CAMERA: "CAMERA",
  SPEAKER: "SPEAKER",
  BACKDOOR: "BACKDOOR",
  GLASS: "GLASS",
  IC: "IC",
  ACCESSORY: "ACCESSORY",
  OTHER: "OTHER",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus];

export const ServiceStatus = {
  PENDING: "PENDING",
  PROCESS: "PROCESS",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
  TAKEN: "TAKEN",
};

export type ServiceLogAction =
  (typeof ServiceLogAction)[keyof typeof ServiceLogAction];

export const ServiceLogAction = {
  CREATED: "CREATED",
  UPDATE_INFO: "UPDATE_INFO",
  UPDATE_STATUS: "UPDATE_STATUS",
  UPDATE_TECHNICIAN: "UPDATE_TECHNICIAN",
  UPDATE_SERVICE_LIST: "UPDATE_SERVICE_LIST",
  UPDATE_DISCOUNT: "UPDATE_DISCOUNT",
  UPDATE_DOWN_PAYMENT: "UPDATE_DOWN_PAYMENT",
  UPDATE_FINANCIALS: "UPDATE_FINANCIALS",
  DELETED: "DELETED",
};

export const ROLE_OPTIONS = Object.values(UserRole).map((value) => ({
  value: value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const BRAND_OPTIONS = Object.values(Brand).map((value) => ({
  value: value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const CATEGORY_OPTIONS = Object.values(Category).map((value) => ({
  value: value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const SERVICE_STATUS_OPTIONS = Object.values(ServiceStatus).map(
  (value) => ({
    value: value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  }),
);
