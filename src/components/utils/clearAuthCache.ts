export const clearAuthCache = (identifier: string) => {
  if (!identifier) return;

  const idLower = identifier.toLowerCase();
  localStorage.removeItem(`resend_verif_${idLower}`);
  localStorage.removeItem(`verif_email_cache_${idLower}`);
  localStorage.removeItem(`reset_pass_${idLower}`);
  localStorage.removeItem(`reset_email_cache_${idLower}`);
};
