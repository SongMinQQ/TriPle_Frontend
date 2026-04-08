import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";

const SECONDARY_AUTHORIZATION_HEADER = "Secondary-Authorization";

const readResponseHeaderValue = (
  headers: unknown,
  headerName: string
): string | null => {
  if (!headers) {
    return null;
  }

  if (
    typeof headers === "object" &&
    headers !== null &&
    typeof (headers as { get?: unknown }).get === "function"
  ) {
    const reader = headers as { get: (targetHeaderName: string) => unknown };
    const headerValue = reader.get(headerName);

    return typeof headerValue === "string" && headerValue.trim()
      ? headerValue.trim()
      : null;
  }

  if (typeof headers === "object" && headers !== null) {
    const map = headers as Record<string, unknown>;
    const headerValue =
      map[headerName] ?? map[headerName.toLowerCase()] ?? map[headerName.toUpperCase()];

    return typeof headerValue === "string" && headerValue.trim()
      ? headerValue.trim()
      : null;
  }

  return null;
};

export const issueScheduleSecondaryToken = async (
  travelId: number
): Promise<string> => {
  const response = await api.post(
    REQUEST_PATHS.TRAVELS.SECONDARY_TOKEN(travelId),
    new URLSearchParams(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const secondaryAuthorization = readResponseHeaderValue(
    response.headers,
    SECONDARY_AUTHORIZATION_HEADER
  );

  if (!secondaryAuthorization) {
    throw new Error("Secondary-Authorization 응답 헤더를 찾을 수 없습니다.");
  }

  return secondaryAuthorization;
};
