import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApiErrorResponse {
  errors?: string;
  details?: {
    message: string;
    path: string[];
  }[];
}

export function handleApiError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0].message;
  }

  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;

    if (response) {
      if (response.errors === "Validation Error" && response.details) {
        return response.details[0].message;
      }

      if (response.errors) {
        return response.errors;
      }
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
