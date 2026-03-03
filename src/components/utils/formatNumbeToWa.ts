export const formatPhoneNumberToWA = (phone: string | undefined | null) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

  if (!cleaned) return "";

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
};
