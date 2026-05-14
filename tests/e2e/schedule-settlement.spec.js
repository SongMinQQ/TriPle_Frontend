const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const ACCESS_TOKEN = "mock-access-token";
const USER_ME_API_PATTERN = "**/users/me";
const GROUP_MENU_API_PATTERN = "**/groups/1/menu";
const TRAVEL_INFO_API_PATTERN = "**/travels/42/info";
const SECONDARY_TOKEN_API_PATTERN = "**/travels/42/secondary-token";
const TRANSFER_API_PATTERN = "**/travels/42/transfer";

const seedAccessToken = async (page) => {
  await page.addInitScript(
    ({ key, token }) => {
      window.sessionStorage.setItem(key, token);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, token: ACCESS_TOKEN }
  );
};

const installMockWebSocket = async (page) => {
  await page.addInitScript(() => {
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
          this.readyState = MockWebSocket.OPEN;
          this.#emit("open");
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
  });
};

const mockScheduleDetailDependencies = async (page) => {
  await page.route(USER_ME_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        publicUuid: "user-public-id",
        nickname: "철수",
        gender: "MALE",
        birth: "1999-01-16",
        description: "일정 리더",
        profileUrl: "https://example.com/owner.png",
      }),
    });
  });

  await page.route(GROUP_MENU_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        name: "테스트 그룹",
        description: "정산 테스트용 그룹",
        currentMemberCount: 3,
        memberLimit: 10,
        thumbNailUrl: "https://example.com/group.png",
        role: "MEMBER",
      }),
    });
  });

  await page.route(TRAVEL_INFO_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "제주도 정산 여행",
        startAt: "2026-03-01T00:00:00",
        endAt: "2026-03-05T00:00:00",
        members: [
          {
            nickname: "철수",
            profileUrl: "https://example.com/owner.png",
            userRole: "LEADER",
          },
        ],
      }),
    });
  });

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
};

test.describe("Schedule settlement detail", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: 정산 정보 조회 API 응답을 정산 화면에 반영", async ({
    page,
  }) => {
    let transferRequestHeaders = null;

    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(TRANSFER_API_PATTERN, async (route) => {
      transferRequestHeaders = route.request().headers();

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          accountNumber: "123-456",
          bankName: "Test Bank",
          accountHolder: "Kim",
          totalAmount: 10000,
          transferStatus: "IN_PROGRESS",
          members: [
            {
              id: "encrypted-id-1",
              name: "member1",
              avatar: "https://example.com/profile.png",
              amount: 10000,
              settled: false,
            },
            {
              id: "encrypted-id-2",
              name: "member2",
              avatar: "https://example.com/profile-2.png",
              amount: 0,
              settled: false,
            },
            {
              id: "encrypted-id-3",
              name: "member3",
              avatar: "https://example.com/profile-3.png",
              amount: 0,
              settled: false,
            },
          ],
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "정산 보기" }).click();

    expect(transferRequestHeaders.authorization).toBe(`Bearer ${ACCESS_TOKEN}`);
    await expect(page.getByText("123-456 Test Bank 예금주: Kim")).toBeVisible();
    await expect(page.getByText("총 금액: 10,000원")).toBeVisible();
    await expect(page.getByText("정산 진행 중")).toBeVisible();
    await expect(page.getByText("member1", { exact: true })).toBeVisible();
    await expect(page.getByText("10,000", { exact: true })).toBeVisible();
    await expect(page.getByText("정산 미완료")).toHaveCount(3);

    await page.getByRole("button", { name: "N/1 하기" }).click();

    await expect(page.getByText("3,334", { exact: true })).toBeVisible();
    await expect(page.getByText("3,333", { exact: true })).toHaveCount(2);
  });

  test("Fail Case: 정산 정보 조회 실패 시 에러 UI와 토스트를 표시", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(TRANSFER_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "정산 정보를 불러올 수 없습니다.",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "정산 보기" }).click();

    await expect(page.getByText("정산 정보를 불러오지 못했어요")).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
    await expect(
      page.getByText("정산 정보 조회 실패", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText("정산 정보를 불러올 수 없습니다.", { exact: true }).first()
    ).toBeVisible();
  });
});
