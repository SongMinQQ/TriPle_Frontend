const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const USER_ME_API_PATTERN = "**/users/me";
const REFRESH_API_PATTERN = "**/auth/refresh";
const LOGIN_BUTTON_SELECTOR =
  'button:has(img[src*="kakao_login_medium_narrow.png"])';
const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const EXPIRED_ACCESS_TOKEN = "expired-access-token";
const REISSUED_ACCESS_TOKEN = "reissued-access-token";
const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_VALUE = "old-refresh-token";

const seedAccessToken = async (page, token) => {
  await page.addInitScript(
    ({ key, value }) => {
      window.sessionStorage.setItem(key, value);
    },
    { key: ACCESS_TOKEN_STORAGE_KEY, value: token }
  );
};

const seedRefreshCookie = async (page) => {
  await page.context().addCookies([
    {
      name: REFRESH_COOKIE_NAME,
      value: REFRESH_COOKIE_VALUE,
      domain: "dev.triple.io.kr",
      path: "/auth",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
  ]);
};

test.describe("Access token refresh flow", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: 401 response triggers /auth/refresh and retries the original request", async ({
    page,
  }) => {
    let userMeRequestCount = 0;
    let refreshCookieHeader = null;

    await seedAccessToken(page, EXPIRED_ACCESS_TOKEN);
    await seedRefreshCookie(page);

    await page.route(USER_ME_API_PATTERN, async (route) => {
      userMeRequestCount += 1;
      const authorizationHeader = route.request().headers().authorization;

      if (authorizationHeader === `Bearer ${EXPIRED_ACCESS_TOKEN}`) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "expired access token" }),
        });
        return;
      }

      if (authorizationHeader === `Bearer ${REISSUED_ACCESS_TOKEN}`) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            publicUuid: "encrypted-public-uuid-refresh",
            nickname: "refresh-user",
            gender: "MALE",
            birth: "1999-01-16",
            description: "hello",
            profileUrl: "https://example.com/profile.png",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: `unexpected authorization header: ${authorizationHeader}`,
        }),
      });
    });

    await page.route(REFRESH_API_PATTERN, async (route) => {
      refreshCookieHeader = route.request().headers().cookie ?? null;

      await route.fulfill({
        status: 200,
        headers: {
          authorization: `Bearer ${REISSUED_ACCESS_TOKEN}`,
          "access-control-expose-headers": "Authorization",
          "set-cookie":
            "refresh_token=new-refresh-token; Path=/auth; HttpOnly; Secure; SameSite=None",
        },
        body: "",
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/mypage`);

    await expect(
      page.getByRole("heading", { name: "refresh-user" })
    ).toBeVisible();

    const storedAccessToken = await page.evaluate((storageKey) => {
      return window.sessionStorage.getItem(storageKey);
    }, ACCESS_TOKEN_STORAGE_KEY);

    expect(userMeRequestCount).toBeGreaterThanOrEqual(2);
    expect(refreshCookieHeader).toContain(`${REFRESH_COOKIE_NAME}=${REFRESH_COOKIE_VALUE}`);
    expect(storedAccessToken).toBe(REISSUED_ACCESS_TOKEN);
  });

  test("Fail Case: refresh failure clears session and redirects to home", async ({
    page,
  }) => {
    await seedAccessToken(page, EXPIRED_ACCESS_TOKEN);
    await seedRefreshCookie(page);

    await page.route(USER_ME_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "expired access token" }),
      });
    });

    await page.route(REFRESH_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "invalid refresh token" }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/mypage`);

    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/`);
    await expect(page.locator(LOGIN_BUTTON_SELECTOR)).toBeVisible();

    const storedAccessToken = await page.evaluate((storageKey) => {
      return window.sessionStorage.getItem(storageKey);
    }, ACCESS_TOKEN_STORAGE_KEY);
    expect(storedAccessToken).toBeNull();
  });
});
