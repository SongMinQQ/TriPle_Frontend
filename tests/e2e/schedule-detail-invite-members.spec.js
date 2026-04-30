const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const ACCESS_TOKEN = "mock-access-token";
const USER_ME_API_PATTERN = "**/users/me";
const GROUP_MENU_API_PATTERN = "**/groups/1/menu";
const TRAVEL_INFO_API_PATTERN = "**/travels/42/info";
const GROUP_MEMBERS_API_PATTERN = "**/groups/1/users";
const SECONDARY_TOKEN_API_PATTERN = "**/travels/42/secondary-token";
const ADD_TRAVEL_MEMBER_API_PATTERN = "**/travels/42/user";
const LEAVE_TRAVEL_API_PATTERN = "**/travels/42/users/me";

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
        description: "일정 초대 테스트용 그룹",
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
        title: "제주도 뚜벅코 탐험",
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

test.describe("Schedule detail invite candidate members", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: Plus 버튼으로 일정에 없는 그룹원만 표시하고 캐시를 재사용", async ({
    page,
  }) => {
    let groupMembersRequestCount = 0;

    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      groupMembersRequestCount += 1;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            {
              id: "owner-public-id",
              name: "철수",
              description: "모임장",
              profileUrl: "https://example.com/owner.png",
              isOwner: true,
            },
            {
              id: "friend-public-id",
              name: "영희",
              description: "여행 친구",
              profileUrl: "https://example.com/friend.png",
              isOwner: false,
            },
            {
              id: "member-public-id",
              name: "민규",
              description: "멤버",
              profileUrl: "https://example.com/member.png",
              isOwner: false,
            },
          ],
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);

    await expect(page.getByText("제주도 뚜벅코 탐험", { exact: true })).toBeVisible();
    const inviteButton = page.getByRole("button", {
      name: "초대 가능한 그룹원 보기",
    });

    await inviteButton.click();

    const invitePopover = page.getByRole("dialog");
    await expect(invitePopover.getByText("초대 가능한 그룹원", { exact: true })).toBeVisible();
    await expect(invitePopover.getByText("영희", { exact: true })).toBeVisible();
    await expect(invitePopover.getByText("민규", { exact: true })).toBeVisible();
    await expect(invitePopover.getByText("철수", { exact: true })).toHaveCount(0);

    await page.keyboard.press("Escape");
    await inviteButton.click();
    await expect(invitePopover.getByText("영희", { exact: true })).toBeVisible();
    expect(groupMembersRequestCount).toBe(1);
  });

  test("Success Case: 초대 가능 그룹원을 일정 멤버로 추가", async ({
    page,
  }) => {
    let addMemberRequestBody = null;

    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            {
              id: "owner-public-id",
              name: "철수",
              description: "모임장",
              profileUrl: "https://example.com/owner.png",
              isOwner: true,
            },
            {
              id: "friend-public-id",
              name: "영희",
              description: "여행 친구",
              profileUrl: "https://example.com/friend.png",
              isOwner: false,
            },
          ],
        }),
      });
    });
    await page.route(ADD_TRAVEL_MEMBER_API_PATTERN, async (route) => {
      addMemberRequestBody = route.request().postDataJSON();

      await route.fulfill({
        status: 200,
        body: "",
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "초대 가능한 그룹원 보기" }).click();
    await page.getByRole("button", { name: "추가" }).click();

    expect(addMemberRequestBody).toEqual({
      userUuid: "friend-public-id",
    });
    await expect(page.getByText("여행 멤버 추가 완료", { exact: true })).toBeVisible();
  });

  test("Success Case: 내 일정 멤버 X 버튼으로 스스로 일정 탈퇴", async ({
    page,
  }) => {
    let leaveRequestCount = 0;

    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(LEAVE_TRAVEL_API_PATTERN, async (route) => {
      leaveRequestCount += 1;

      await route.fulfill({
        status: 200,
        body: "",
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "철수 일정 탈퇴" }).click();

    expect(leaveRequestCount).toBe(1);
    await expect(page.getByText("여행 일정 탈퇴 완료", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/group/1/schedules`);
  });

  test("Fail Case: 그룹 멤버 조회 실패 시 토스트와 재시도 UI를 표시", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          message: "PRIVATE 그룹 멤버 목록은 조회할 수 없습니다.",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "초대 가능한 그룹원 보기" }).click();

    await expect(
      page.getByText("초대 가능한 그룹원을 불러오지 못했어요", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
    await expect(page.getByText("그룹 멤버 조회 실패", { exact: true })).toBeVisible();
    await expect(
      page.getByText("PRIVATE 그룹 멤버 목록은 조회할 수 없습니다.", { exact: true })
    ).toBeVisible();
  });

  test("Fail Case: 여행 멤버 추가 실패 시 에러 토스트를 표시", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await installMockWebSocket(page);
    await mockScheduleDetailDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            {
              id: "owner-public-id",
              name: "철수",
              description: "모임장",
              profileUrl: "https://example.com/owner.png",
              isOwner: true,
            },
            {
              id: "friend-public-id",
              name: "영희",
              description: "여행 친구",
              profileUrl: "https://example.com/friend.png",
              isOwner: false,
            },
          ],
        }),
      });
    });
    await page.route(ADD_TRAVEL_MEMBER_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          message: "이미 여행 멤버인 사용자입니다.",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/42`);
    await page.getByRole("button", { name: "초대 가능한 그룹원 보기" }).click();
    await page.getByRole("button", { name: "추가" }).click();

    await expect(page.getByText("여행 멤버 추가 실패", { exact: true })).toBeVisible();
    await expect(
      page.getByText("이미 여행 멤버인 사용자입니다.", { exact: true })
    ).toBeVisible();
  });
});
