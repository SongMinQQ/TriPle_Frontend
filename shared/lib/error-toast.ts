"use client";

import { isAxiosError } from "axios";
import { toast } from "@/shared/hooks/use-toast";
import { AUTHORIZATION_HEADER } from "@/shared/lib/access-token";
import type { ToastProps } from "@/shared/ui/toast";

interface ShowErrorToastOptions {
  error: unknown;
  title: string;
  fallbackDescription: string;
  variant?: ToastProps["variant"];
}

const hasAuthorizationHeader = (headers: unknown): boolean => {
  if (!headers) {
    return false;
  }

  if (
    typeof headers === "object" &&
    headers !== null &&
    typeof (headers as { get?: unknown }).get === "function"
  ) {
    return Boolean((headers as { get: (headerName: string) => unknown }).get(AUTHORIZATION_HEADER));
  }

  if (typeof headers === "object" && headers !== null) {
    const map = headers as Record<string, unknown>;
    return Boolean(
      map.authorization ?? map.Authorization ?? map[AUTHORIZATION_HEADER]
    );
  }

  return false;
};

export const isHandledSessionExpiredError = (error: unknown): boolean => {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    return false;
  }

  return hasAuthorizationHeader(error.config?.headers);
};

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
  if (isHandledSessionExpiredError(error)) {
    return;
  }

  toast({
    variant,
    title,
    description: getErrorMessageFromUnknown(error) ?? fallbackDescription,
  });
};
