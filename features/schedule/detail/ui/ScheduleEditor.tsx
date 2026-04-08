"use client";

import { LoaderCircle, UsersRound, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCurrentUserStore } from "@/entities/user/model/currentUserStore";
import { issueScheduleSecondaryToken } from "@/entities/schedule/model/api/issueScheduleSecondaryToken";
import { parseRouteScheduleId } from "@/entities/schedule/queries/schedule.query-utils";
import {
  createScheduleEditorWebSocketPolyfill,
  getCollaborationStatusLabel,
  getCollaborationUser,
  getConnectionBadgeClassName,
  getScheduleEditorConnectionFailureMessage,
  getScheduleEditorWebSocketServerUrl,
  mapWebSocketStatusToConnectionStatus,
  scheduleEditorToolbarOptions,
  type ScheduleEditorConnectionStatus,
  type ScheduleEditorWebSocketStatus,
} from "@/features/schedule/detail/model/scheduleEditorUtils";
import { TOAST_MESSAGES } from "@/shared/constants/toast";
import { showErrorToast } from "@/shared/lib/error-toast";

type ScheduleEditorProps = {
  documentName: string;
  travelId: string;
};

const renderConnectionStatusIcon = (connectionStatus: ScheduleEditorConnectionStatus) => {
  if (connectionStatus === "connected") {
    return <Wifi className="h-3.5 w-3.5" />;
  }

  if (connectionStatus === "offline") {
    return <WifiOff className="h-3.5 w-3.5" />;
  }

  return <LoaderCircle className="h-3.5 w-3.5 animate-spin" />;
};

export function ScheduleEditor({ documentName, travelId }: ScheduleEditorProps) {
  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const providerRef = useRef<import("y-websocket").WebsocketProvider | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ScheduleEditorConnectionStatus>("connecting");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [isInitializationFailed, setIsInitializationFailed] = useState(false);
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  useEffect(() => {
    let isCancelled = false;
    let containerElement: HTMLDivElement | null = null;
    let binding: import("y-quill").QuillBinding | null = null;
    let doc: import("yjs").Doc | null = null;
    let provider: import("y-websocket").WebsocketProvider | null = null;
    let isInitialConnectionEstablished = false;
    let connectionTimeoutId: ReturnType<typeof window.setTimeout> | null = null;

    const waitForInitialConnection = (
      activeProvider: import("y-websocket").WebsocketProvider
    ): Promise<void> =>
      new Promise((resolve, reject) => {
        let settled = false;
        let pendingErrorEvent: Event | null = null;
        connectionTimeoutId = window.setTimeout(() => {
          rejectOnce(new Error("웹소켓 연결 시간이 초과되었습니다."));
        }, 10000);

        const cleanup = () => {
          const observableProvider = activeProvider as {
            off?: (
              eventName: string,
              listener: (...eventArgs: unknown[]) => void
            ) => void;
          };

          observableProvider.off?.("status", handleInitialStatus);
          observableProvider.off?.("connection-close", handleInitialClose);
          observableProvider.off?.("connection-error", handleInitialError);

          if (connectionTimeoutId !== null) {
            window.clearTimeout(connectionTimeoutId);
            connectionTimeoutId = null;
          }
        };

        const resolveOnce = () => {
          if (settled) {
            return;
          }

          settled = true;
          cleanup();
          resolve();
        };

        const rejectOnce = (error: Error) => {
          if (settled) {
            return;
          }

          settled = true;
          cleanup();
          reject(error);
        };

        const handleInitialStatus = ({
          status,
        }: {
          status: ScheduleEditorWebSocketStatus;
        }) => {
          if (status === "connected") {
            resolveOnce();
          }
        };

        const handleInitialClose = (event: CloseEvent | null) => {
          rejectOnce(
            new Error(
              getScheduleEditorConnectionFailureMessage(event ?? pendingErrorEvent)
            )
          );
        };

        const handleInitialError = (event: Event) => {
          pendingErrorEvent = event;
        };

        activeProvider.on("status", handleInitialStatus);
        activeProvider.on("connection-close", handleInitialClose);
        activeProvider.on("connection-error", handleInitialError);
      });

    const initializeEditor = async () => {
      try {
        const numericTravelId = parseRouteScheduleId(
          travelId,
          "schedule-collaboration-editor"
        );
        const webSocketServerUrl = getScheduleEditorWebSocketServerUrl(numericTravelId);

        if (!webSocketServerUrl) {
          throw new Error("협업 웹소켓 서버 주소가 설정되지 않았습니다.");
        }

        const secondaryAuthorization =
          await issueScheduleSecondaryToken(numericTravelId);

        const [
          QuillModule,
          QuillCursorsModule,
          YjsModule,
          YQuillModule,
          YWebsocketModule,
        ] = await Promise.all([
          import("quill"),
          import("quill-cursors"),
          import("yjs"),
          import("y-quill"),
          import("y-websocket"),
        ]);

        if (isCancelled) {
          return;
        }

        const editorHost = editorHostRef.current;

        if (!(editorHost instanceof HTMLDivElement)) {
          throw new Error("에디터 컨테이너를 찾을 수 없습니다.");
        }

        containerElement = editorHost;
        containerElement.innerHTML = "";

        const Quill = QuillModule.default;
        const QuillCursors = QuillCursorsModule.default;
        const { QuillBinding } = YQuillModule;
        const { WebsocketProvider } = YWebsocketModule;

        Quill.register("modules/cursors", QuillCursors, true);

        doc = new YjsModule.Doc();
        provider = new WebsocketProvider(webSocketServerUrl, documentName, doc, {
          WebSocketPolyfill: createScheduleEditorWebSocketPolyfill(webSocketServerUrl),
          connect: false,
          disableBc: true,
          params: {
            secondaryToken: secondaryAuthorization,
          },
          maxBackoffTime: 2500,
        });
        providerRef.current = provider;

        const yText = doc.getText("schedule-itinerary");
        const collaborationUser = getCollaborationUser(currentUser);

        provider.awareness.setLocalStateField("user", collaborationUser);

        const quill = new Quill(containerElement, {
          modules: {
            cursors: {
              hideDelayMs: 3000,
              transformOnTextChange: true,
            },
            history: {
              userOnly: true,
            },
            toolbar: scheduleEditorToolbarOptions,
          },
          placeholder: "같은 일정 페이지에 접속한 팀원과 함께 일정을 작성해 보세요.",
          theme: "snow",
        });

        binding = new QuillBinding(yText, quill, provider.awareness);

        const syncPeerCount = () => {
          if (!provider || isCancelled) {
            return;
          }

          setPeerCount(Math.max(provider.awareness.getStates().size - 1, 0));
        };

        provider.on("status", ({ status }: { status: ScheduleEditorWebSocketStatus }) => {
          if (isCancelled) {
            return;
          }

          setConnectionStatus(mapWebSocketStatusToConnectionStatus(status));
        });
        provider.on("connection-close", (event: CloseEvent | null) => {
          if (isCancelled || !isInitialConnectionEstablished) {
            return;
          }

          setConnectionStatus("offline");

          if (event?.reason) {
            showErrorToast({
              error: new Error(getScheduleEditorConnectionFailureMessage(event)),
              title: TOAST_MESSAGES.SCHEDULE.COLLABORATION_EDITOR_INIT_FAILURE.title,
              fallbackDescription:
                TOAST_MESSAGES.SCHEDULE.COLLABORATION_EDITOR_INIT_FAILURE.description,
            });
          }
        });
        provider.awareness.on("change", syncPeerCount);

        const initialConnectionPromise = waitForInitialConnection(provider);

        provider.connect();
        provider.shouldConnect = false;
        syncPeerCount();
        await initialConnectionPromise;
        isInitialConnectionEstablished = true;
        setConnectionStatus("connected");
        setIsEditorReady(true);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setConnectionStatus("offline");
        setIsInitializationFailed(true);
        showErrorToast({
          error,
          title: TOAST_MESSAGES.SCHEDULE.COLLABORATION_EDITOR_INIT_FAILURE.title,
          fallbackDescription:
            TOAST_MESSAGES.SCHEDULE.COLLABORATION_EDITOR_INIT_FAILURE.description,
        });
      }
    };

    setConnectionStatus("connecting");
    setIsEditorReady(false);
    setIsInitializationFailed(false);
    setPeerCount(0);

    void initializeEditor();

    return () => {
      isCancelled = true;

      if (connectionTimeoutId !== null) {
        window.clearTimeout(connectionTimeoutId);
        connectionTimeoutId = null;
      }

      binding?.destroy();
      provider?.destroy();
      doc?.destroy();
      providerRef.current = null;

      if (containerElement) {
        containerElement.innerHTML = "";
      }
    };
  }, [documentName, travelId]);

  useEffect(() => {
    if (!providerRef.current) {
      return;
    }

    providerRef.current.awareness.setLocalStateField(
      "user",
      getCollaborationUser(currentUser)
    );
  }, [currentUser]);

  const collaborationStatusLabel = getCollaborationStatusLabel(connectionStatus, peerCount);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/50 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">실시간 일정 편집</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            같은 일정 페이지에 접속한 팀원과 동시에 편집할 수 있어요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium ${getConnectionBadgeClassName(
              connectionStatus
            )}`}
          >
            {renderConnectionStatusIcon(connectionStatus)}
            {collaborationStatusLabel}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
            <UsersRound className="h-3.5 w-3.5" />
            {peerCount}
            명 참여 중
          </span>
        </div>
      </div>

      <div className="schedule-collaboration-editor">
        <div ref={editorHostRef} className="min-h-[420px]" />
      </div>

      {!isEditorReady && !isInitializationFailed ? (
        <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          협업 에디터를 준비하고 있어요.
        </div>
      ) : null}

      {isEditorReady ? (
        <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          문서가 비어 있으면 첫 일정을 직접 입력해 주세요. 이후 변경 내용은 같은 페이지를 연
          팀원에게 바로 공유됩니다.
        </div>
      ) : null}

      {isInitializationFailed ? (
        <div className="border-t border-border bg-red-50 px-4 py-2 text-xs text-red-700">
          협업 에디터를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.
        </div>
      ) : null}
    </div>
  );
}
