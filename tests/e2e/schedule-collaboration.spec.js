const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const ACCESS_TOKEN = "mock-access-token";
const USER_ME_API_PATTERN = "**/users/me";
const TRAVEL_INFO_API_PATTERN = "**/travels/42/info";
const SECONDARY_TOKEN_API_PATTERN = "**/travels/42/secondary-token";
const EXPECTED_WEBSOCKET_URL =
  "wss://dev.triple.io.kr/ws/travels/42?secondaryToken=Bearer%20secondary-token-42";

const seedAccessToken = async (page) => {
  await page.addInitScript(
    ({ key, token }) => {
      window.sessionStorage.setItem(key, token);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, token: ACCESS_TOKEN }
  );
};

const installMockWebSocket = async (page, mode = "success") => {
  await page.addInitScript(({ desiredMode }) => {
    const sockets = [];

    class MockWebSocket {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;

      constructor(url) {
        this.url = url;
        this.readyState = MockWebSocket.CONNECTING;
        this.binaryType = "arraybuffer";
        this.OPEN = MockWebSocket.OPEN;
        this.CLOSED = MockWebSocket.CLOSED;
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        this.sentMessages = [];
        this.listeners = new Map();
        sockets.push(this);

        queueMicrotask(() => {
          if (desiredMode === "success") {
            this.readyState = MockWebSocket.OPEN;
            this.#emit("open");
            return;
          }

          this.readyState = MockWebSocket.CLOSED;
          this.#emit("error", new Event("error"));
          this.#emit("close", {
            code: 1006,
            reason: "WebSocket handshake failed",
          });
        });
      }

      addEventListener(type, listener) {
        const listeners = this.listeners.get(type) ?? [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
      }

      removeEventListener(type, listener) {
        const listeners = this.listeners.get(type) ?? [];
        this.listeners.set(
          type,
          listeners.filter((registeredListener) => registeredListener !== listener)
        );
      }

      send(data) {
        this.sentMessages.push(data);
      }

      close(code = 1000, reason = "") {
        this.readyState = MockWebSocket.CLOSED;
        this.#emit("close", {
          code,
          reason,
        });
      }

      #emit(type, event = {}) {
        const handler = this[`on${type}`];
        if (typeof handler === "function") {
          handler(event);
        }

        const listeners = this.listeners.get(type) ?? [];
        for (const listener of listeners) {
          listener(event);
        }
      }
    }

    window.__mockSockets = sockets;
    window.WebSocket = MockWebSocket;
  }, { desiredMode: mode });
};

const mockAuthenticatedPageDependencies = async (page) => {
  await page.route(USER_ME_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        publicUuid: "user-public-id",
        nickname: "테스터",
        gender: "MALE",
        birth: "1999-01-16",
        description: "hello",
        profileUrl: "https://example.com/profile.png",
      }),
    });
  });

  await page.route(TRAVEL_INFO_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "제주도 뚜벅코 탐험",
        startAt: "2026-03-01T00:00:00",
        endAt: "2026-03-05T00:00:00",
        members: [
          {
            nickname: "테스터",
            profileUrl: "https://example.com/profile.png",
            userRole: "LEADER",
          },
        ],
      }),
    });
  });
};

test.describe("Schedule collaboration editor websocket flow", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: secondary token header is requested and websocket connects with encoded query", async ({
    page,
  }) => {
    let secondaryTokenRequestHeaders = null;

    await seedAccessToken(page);
    await installMockWebSocket(page, "success");
    await mockAuthenticatedPageDependencies(page);
    await page.route(SECONDARY_TOKEN_API_PATTERN, async (route) => {
      secondaryTokenRequestHeaders = route.request().headers();

      await route.fulfill({
        status: 200,
        headers: {
          "Secondary-Authorization": "Bearer secondary-token-42",
          "access-control-expose-headers": "Secondary-Authorization",
        },
        body: "",
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);

    await expect(page.getByText("협업 연결됨", { exact: true })).toBeVisible();
    await expect(
      page.getByText("문서가 비어 있으면 첫 일정을 직접 입력해 주세요.", { exact: false })
    ).toBeVisible();

    const socketUrl = await page.evaluate(() => {
      return (
        window.__mockSockets
          ?.map((socket) => socket.url)
          .find((url) => url.includes("secondaryToken=")) ?? null
      );
    });

    expect(secondaryTokenRequestHeaders.authorization).toBe(`Bearer ${ACCESS_TOKEN}`);
    expect(secondaryTokenRequestHeaders["content-type"]).toContain(
      "application/x-www-form-urlencoded"
    );
    expect(socketUrl).toBe(EXPECTED_WEBSOCKET_URL);
  });

  test("Fail Case: websocket 연결 실패 시 오프라인 상태와 에러 피드백을 표시", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await installMockWebSocket(page, "failure");
    await mockAuthenticatedPageDependencies(page);
    await page.route(SECONDARY_TOKEN_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Secondary-Authorization": "Bearer secondary-token-42",
          "access-control-expose-headers": "Secondary-Authorization",
        },
        body: "",
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);

    await expect(page.getByText("일정 협업 에디터 준비 실패", { exact: true })).toBeVisible();
    await expect(page.getByText("연결 확인 필요", { exact: true })).toBeVisible();
    await expect(page.getByText("WebSocket handshake failed", { exact: true })).toBeVisible();

    const socketUrl = await page.evaluate(() => {
      return (
        window.__mockSockets
          ?.map((socket) => socket.url)
          .find((url) => url.includes("secondaryToken=")) ?? null
      );
    });

    expect(socketUrl).toBe(EXPECTED_WEBSOCKET_URL);
  });
});
