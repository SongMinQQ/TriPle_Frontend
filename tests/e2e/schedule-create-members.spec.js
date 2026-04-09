const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const ACCESS_TOKEN = "mock-access-token";
const USER_ME_API_PATTERN = "**/users/me";
const GROUP_MENU_API_PATTERN = "**/groups/1/menu";
const GROUP_MEMBERS_API_PATTERN = "**/groups/1/users";

const seedAccessToken = async (page) => {
  await page.addInitScript(
    ({ key, token }) => {
      window.sessionStorage.setItem(key, token);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, token: ACCESS_TOKEN }
  );
};

const mockAuthenticatedLayoutDependencies = async (page) => {
  await page.route(USER_ME_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        publicUuid: "member-public-id",
        nickname: "테스터",
        gender: "MALE",
        birth: "1999-01-16",
        description: "같은 사람",
        profileUrl: "https://example.com/me.png",
      }),
    });
  });

  await page.route(GROUP_MENU_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        name: "테스트 그룹",
        description: "일정 생성 테스트용 그룹",
        currentMemberCount: 3,
        memberLimit: 10,
        thumbNailUrl: "https://example.com/group.png",
        role: "MEMBER",
      }),
    });
  });
};

test.describe("Schedule create member selection", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: 현재 사용자 정보와 그룹 멤버 id가 달라도 멤버는 한 번만 노출", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await mockAuthenticatedLayoutDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            {
              id: "owner-public-id",
              name: "그룹장",
              description: "모임장",
              profileUrl: "https://example.com/owner.png",
              isOwner: true,
            },
            {
              id: "group-member-user-id",
              name: "테스터",
              description: "같은 사람",
              profileUrl: "https://example.com/me.png",
              isOwner: false,
            },
            {
              id: "friend-public-id",
              name: "동행자",
              description: "친구",
              profileUrl: "https://example.com/friend.png",
              isOwner: false,
            },
          ],
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/create`);

    const form = page.locator("form");
    const currentUserMemberButton = form.locator("button").filter({ hasText: "테스터" });
    const friendMemberButton = form.locator("button").filter({ hasText: "동행자" });

    await expect(page.getByText("일정 생성", { exact: true })).toBeVisible();
    await expect(currentUserMemberButton).toHaveCount(1);
    await expect(currentUserMemberButton.first()).toBeDisabled();
    await expect(currentUserMemberButton.first()).toContainText("나");
    await expect(friendMemberButton).toHaveCount(1);
  });

  test("Fail Case: 멤버 목록 조회 실패 시 에러 메시지와 재시도 버튼을 노출", async ({
    page,
  }) => {
    await seedAccessToken(page);
    await mockAuthenticatedLayoutDependencies(page);
    await page.route(GROUP_MEMBERS_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "멤버 목록 조회 실패",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/group/1/schedules/create`);

    await expect(
      page.getByText("일정 생성에 필요한 정보를 불러오지 못했습니다.", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
  });
});
