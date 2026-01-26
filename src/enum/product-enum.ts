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

export const BRAND_OPTIONS = Object.values(Brand).map((value) => ({
  value: value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const CATEGORY_OPTIONS = Object.values(Category).map((value) => ({
  value: value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
