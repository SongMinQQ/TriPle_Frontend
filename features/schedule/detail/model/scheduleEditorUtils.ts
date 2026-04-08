import type { UserProfile } from "@/entities/user/model/types";

export type ScheduleEditorConnectionStatus = "connecting" | "connected" | "offline";

export type ScheduleEditorWebSocketStatus = "connecting" | "connected" | "disconnected";

type ScheduleEditorConnectionFailureEvent = CloseEvent | Event | null | undefined;

export type ScheduleEditorCollaborationUser = {
  color: string;
  name: string;
};

const COLLABORATION_COLOR_PALETTE = [
  "#f97316",
  "#0f766e",
  "#2563eb",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

/**
 * 일정 협업 에디터에서 공통으로 사용하는 Quill 툴바 설정입니다.
 */
export const scheduleEditorToolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

/**
 * `useParams` 결과에서 첫 번째 문자열 값을 안전하게 꺼냅니다.
 */
export const getRouteParam = (param: string | string[] | undefined): string =>
  Array.isArray(param) ? param[0] ?? "" : param ?? "";

/**
 * 일정 협업 문서명을 `scheduleId` 기준으로 생성합니다.
 */
export const getScheduleEditorDocumentName = (scheduleId: string): string => scheduleId || "preview";

/**
 * 협업 웹소켓 서버 주소를 일정 기준 경로까지 포함해 생성합니다.
 */
export const getScheduleEditorWebSocketServerUrl = (travelId: number): string => {
  const configuredServerUrl =
    process.env.NEXT_PUBLIC_SERVER_ADDRESS ??
    process.env.NEXT_PUBLIC_COLLABORATION_WEBSOCKET_URL ??
    "";

  if (!configuredServerUrl) {
    return "";
  }

  const normalizedServerUrl = new URL(configuredServerUrl);
  const websocketProtocol =
    normalizedServerUrl.protocol === "https:"
      ? "wss:"
      : normalizedServerUrl.protocol === "http:"
        ? "ws:"
        : normalizedServerUrl.protocol;

  normalizedServerUrl.protocol = websocketProtocol;
  normalizedServerUrl.pathname = `/ws/travels/${travelId}`;
  normalizedServerUrl.search = "";
  normalizedServerUrl.hash = "";

  return normalizedServerUrl.toString();
};

/**
 * y-websocket provider가 추가한 room path를 제거하고,
 * 서버가 요구하는 query 기반 websocket URL 형식으로 재작성합니다.
 */
export const createScheduleEditorWebSocketPolyfill = (
  serverUrl: string
): typeof WebSocket => {
  const targetServerUrl = new URL(serverUrl);
  const basePath =
    targetServerUrl.pathname === "/"
      ? ""
      : targetServerUrl.pathname.replace(/\/+$/, "");

  return class ScheduleEditorWebSocket extends WebSocket {
    constructor(providerUrl: string | URL, protocols?: string | string[]) {
      const providerConnectionUrl = new URL(
        typeof providerUrl === "string" ? providerUrl : providerUrl.toString()
      );

      const rewrittenUrl = `${targetServerUrl.origin}${basePath}${providerConnectionUrl.search}`;

      if (typeof protocols === "undefined") {
        super(rewrittenUrl);
        return;
      }

      super(rewrittenUrl, protocols);
    }
  };
};

/**
 * 사용자 식별값을 기반으로 협업 커서 색상을 결정합니다.
 */
const getColorFromSeed = (seed: string): string => {
  const hashedValue = Array.from(seed).reduce(
    (accumulator, character) => accumulator + character.charCodeAt(0),
    0
  );

  return COLLABORATION_COLOR_PALETTE[hashedValue % COLLABORATION_COLOR_PALETTE.length];
};

/**
 * 실제 로그인 사용자 정보를 기반으로 협업 사용자 표시 정보를 생성합니다.
 */
export const getCollaborationUser = (
  user: Pick<UserProfile, "id" | "nickname"> | null
): ScheduleEditorCollaborationUser => {
  const trimmedNickname = user?.nickname.trim() || "여행메이트";
  const colorSeed = user?.id || trimmedNickname;

  return {
    color: getColorFromSeed(colorSeed),
    name: trimmedNickname,
  };
};

/**
 * websocket 연결 실패 이벤트를 사용자 메시지로 변환합니다.
 */
export const getScheduleEditorConnectionFailureMessage = (
  event: ScheduleEditorConnectionFailureEvent
): string => {
  if (
    event &&
    "reason" in event &&
    typeof event.reason === "string" &&
    event.reason.trim()
  ) {
    return event.reason.trim();
  }

  if (
    event &&
    "message" in event &&
    typeof event.message === "string" &&
    event.message.trim()
  ) {
    return event.message.trim();
  }

  if (event && "code" in event && typeof event.code === "number") {
    return `웹소켓 연결이 종료되었습니다. (code: ${event.code})`;
  }

  return "웹소켓 연결에 실패했습니다.";
};

/**
 * y-websocket 상태값을 화면 표시용 연결 상태로 변환합니다.
 */
export const mapWebSocketStatusToConnectionStatus = (
  status: ScheduleEditorWebSocketStatus
): ScheduleEditorConnectionStatus => {
  if (status === "connected") {
    return "connected";
  }

  if (status === "disconnected") {
    return "offline";
  }

  return "connecting";
};

/**
 * 현재 연결 상태와 참여자 수를 기반으로 상태 라벨을 반환합니다.
 */
export const getCollaborationStatusLabel = (
  connectionStatus: ScheduleEditorConnectionStatus,
  peerCount: number
): string => {
  if (connectionStatus === "connected") {
    return peerCount > 0 ? "협업 연결됨" : "참여 대기 중";
  }

  if (connectionStatus === "offline") {
    return "연결 확인 필요";
  }

  return "연결 중";
};

/**
 * 연결 상태 배지에 적용할 Tailwind 클래스를 반환합니다.
 */
export const getConnectionBadgeClassName = (
  connectionStatus: ScheduleEditorConnectionStatus
): string => {
  if (connectionStatus === "connected") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (connectionStatus === "offline") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
};
