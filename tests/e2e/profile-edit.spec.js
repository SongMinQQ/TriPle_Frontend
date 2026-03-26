const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const USER_ME_API_PATTERN = "**/users/me";
const USER_UPDATE_API_PATTERN = /\/users(?:\?.*)?$/;
const REFRESH_API_PATTERN = "**/auth/refresh";
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const ACCESS_TOKEN = "mock-access-token";
const LOGIN_BUTTON_SELECTOR =
  'button:has(img[src*="kakao_login_medium_narrow.png"])';

const INITIAL_PROFILE = {
  publicUuid: "encrypted-public-uuid-3",
  nickname: "sangyun",
  gender: "MALE",
  birth: "1999-01-16",
  description: "hi",
  profileUrl: "https://example.com/profile.png",
};

const UPDATED_PROFILE = {
  nickname: "sangyun-updated",
  gender: "FEMALE",
  birth: "2000-02-20",
  description: "updated intro",
  profileUrl: "https://example.com/profile.png",
};

const seedAccessToken = async (page) => {
  await page.addInitScript(
    ({ key, token }) => {
      window.sessionStorage.setItem(key, token);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, token: ACCESS_TOKEN }
  );
};

const mockUserSession = async (page, profile = INITIAL_PROFILE) => {
  await page.route(USER_ME_API_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(profile),
    });
  });
};

const openProfileEditForm = async (page) => {
  await page.goto(`${LOCAL_BASE_URL}/mypage`);
  await expect(page.getByRole("heading", { name: INITIAL_PROFILE.nickname })).toBeVisible();
  await page.getByRole("button", { name: /수정/ }).click();
  await expect(page.getByRole("button", { name: /저장/ })).toBeVisible();
};

const fillProfileEditForm = async (page) => {
  const nicknameInput = page.locator('input[type="text"]').first();
  const genderSelect = page.locator("select").first();
  const birthInput = page.locator('input[type="date"]').first();
  const descriptionTextarea = page.locator("textarea").first();

  await nicknameInput.fill(UPDATED_PROFILE.nickname);
  await genderSelect.selectOption(UPDATED_PROFILE.gender);
  await birthInput.fill(UPDATED_PROFILE.birth);
  await descriptionTextarea.fill(UPDATED_PROFILE.description);
};

test.describe("Profile edit flow", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: PATCH /users 200 OK with empty body still updates cached profile", async ({
    page,
  }) => {
    let updatePayload = null;

    await mockUserSession(page);
    await page.route(USER_UPDATE_API_PATTERN, async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.continue();
        return;
      }

      updatePayload = route.request().postDataJSON();
      expect(route.request().headers().authorization).toBe(`Bearer ${ACCESS_TOKEN}`);

      await route.fulfill({
        status: 200,
        body: "",
      });
    });

    await seedAccessToken(page);
    await openProfileEditForm(page);
    await fillProfileEditForm(page);
    await page.getByRole("button", { name: /저장/ }).click();

    expect(updatePayload).toEqual(UPDATED_PROFILE);
    await expect(page.getByRole("heading", { name: UPDATED_PROFILE.nickname })).toBeVisible();
    await expect(page.getByText("프로필 수정 완료", { exact: true })).toBeVisible();
    await expect(page.getByText("♀ 여성", { exact: true })).toBeVisible();
    await expect(page.getByText("🎂 2000.02.20", { exact: true })).toBeVisible();
    await expect(page.getByText(UPDATED_PROFILE.description, { exact: true })).toBeVisible();
  });

  test("Fail Case: PATCH /users 500 response shows error toast and keeps edit mode", async ({
    page,
  }) => {
    await mockUserSession(page);
    await page.route(USER_UPDATE_API_PATTERN, async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.continue();
        return;
      }

      expect(route.request().headers().authorization).toBe(`Bearer ${ACCESS_TOKEN}`);

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "profile update failed",
        }),
      });
    });

    await seedAccessToken(page);
    await openProfileEditForm(page);
    await fillProfileEditForm(page);
    await page.getByRole("button", { name: /저장/ }).click();

    await expect(page.getByText("프로필 수정 실패", { exact: true })).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toHaveValue(
      UPDATED_PROFILE.nickname
    );
    await expect(page.locator("textarea").first()).toHaveValue(UPDATED_PROFILE.description);
  });

  test("Fail Case: expired session during save shows only session-expired feedback", async ({
    page,
  }) => {
    await mockUserSession(page);
    await page.route(USER_UPDATE_API_PATTERN, async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.continue();
        return;
      }

      expect(route.request().headers().authorization).toBe(`Bearer ${ACCESS_TOKEN}`);

      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "expired access token",
        }),
      });
    });

    await page.route(REFRESH_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "invalid refresh token",
        }),
      });
    });

    await seedAccessToken(page);
    await openProfileEditForm(page);
    await fillProfileEditForm(page);
    await page.getByRole("button", { name: /저장/ }).click();

    await expect(page.getByText("세션 만료", { exact: true })).toBeVisible();
    await expect(page.getByText("프로필 수정 실패", { exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/`);
    await expect(page.locator(LOGIN_BUTTON_SELECTOR)).toBeVisible();

    const accessTokenInStorage = await page.evaluate((storageKey) => {
      return window.sessionStorage.getItem(storageKey);
    }, ACCESS_TOKEN_STORAGE_KEY);
    expect(accessTokenInStorage).toBeNull();
  });
});
