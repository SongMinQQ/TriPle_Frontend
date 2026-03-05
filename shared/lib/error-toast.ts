"use client";

import { isAxiosError } from "axios";
import { toast } from "@/shared/hooks/use-toast";
import type { ToastProps } from "@/shared/ui/toast";

interface ShowErrorToastOptions {
  error: unknown;
  title: string;
  fallbackDescription: string;
  variant?: ToastProps["variant"];
}

/**
 * Axios 응답 또는 일반 Error 객체에서 사용자에게 보여줄 메시지를 추출합니다.
 */
export const getErrorMessageFromUnknown = (error: unknown): string | null => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.message === "string") {
        return record.message;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return null;
};

/**
 * 에러에서 추출한 메시지를 우선 사용하고, 없으면 fallback 문구로 토스트를 출력합니다.
 */
export const showErrorToast = ({
  error,
  title,
  fallbackDescription,
  variant = "destructive",
}: ShowErrorToastOptions) => {
  toast({
    variant,
    title,
    description: getErrorMessageFromUnknown(error) ?? fallbackDescription,
  });
};
