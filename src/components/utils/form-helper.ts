// src/lib/form-helper.ts

export function objectToFormData(
  obj: Record<string, unknown>,
  form?: FormData,
  namespace?: string,
): FormData {
  const fd = form || new FormData();
  let formKey: string;

  for (const property of Object.keys(obj)) {
    const value = obj[property];

    if (namespace) {
      formKey = namespace + "[" + property + "]";
    } else {
      formKey = property;
    }

    if (value === undefined || value === null) {
      continue;
    }

    if (value instanceof Date) {
      fd.append(formKey, value.toISOString());
    } else if (value instanceof File || value instanceof Blob) {
      fd.append(formKey, value);
    } else if (typeof value === "object") {
      objectToFormData(value as Record<string, unknown>, fd, formKey);
    } else {
      fd.append(formKey, String(value));
    }
  }

  return fd;
}
