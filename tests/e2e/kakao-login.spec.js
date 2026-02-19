const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";
const LOGIN_API_PATTERN = "**/auth/login";
const USER_ME_API_PATTERN = "**/users/me";
const KAKAO_AUTH_URL_PATTERN =
  /https:\/\/(accounts\.kakao\.com\/login|kauth\.kakao\.com\/oauth\/authorize)/;
const KAKAO_LOGIN_BUTTON_SELECTOR = 'button:has(img[src*="kakao_login_medium_narrow.png"])';

test.describe("Kakao OAuth callback login", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: home -> kakao login -> callback -> login API -> JSESSIONID stored", async ({
    page,
  }) => {
    let meRequestCount = 0;
    let loginApiOrigin = "";

    await page.route(USER_ME_API_PATTERN, async (route) => {
      meRequestCount += 1;

      if (meRequestCount === 1) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unauthorized" }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          nickname: "test",
          gender: "MALE",
          birth: "1999-01-16",
          description: "hi",
          profileUrl: "https://example.com/profile.png",
        }),
      });
    });

    await page.goto(LOCAL_BASE_URL);
    await expect(page.locator(KAKAO_LOGIN_BUTTON_SELECTOR)).toBeVisible();
    await page.locator(KAKAO_LOGIN_BUTTON_SELECTOR).click();
    await expect(page).toHaveURL(KAKAO_AUTH_URL_PATTERN);

    // After successful Kakao auth, Kakao redirects to /kakao?code=...
    await page.route(LOGIN_API_PATTERN, async (route) => {
      const request = route.request();
      const requestBody = request.postDataJSON();
      loginApiOrigin = new URL(request.url()).origin;

      expect(request.method()).toBe("POST");
      expect(requestBody).toEqual({
        code: "success-code",
        provider: "KAKAO",
      });

      await route.fulfill({
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie": "JSESSIONID=mock-session-id; Path=/; HttpOnly; Secure; SameSite=None",
        },
        body: JSON.stringify({
          nickname: "test",
          email: "test@test.com",
          profileUrl: "https://test.png",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/kakao?code=success-code`);

    await expect(page.getByText("Login complete")).toBeVisible();
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/`);
    await expect(page.locator(KAKAO_LOGIN_BUTTON_SELECTOR)).toHaveCount(0);

    const cookies = await page.context().cookies(loginApiOrigin || LOCAL_BASE_URL);
    const jsession = cookies.find((cookie) => cookie.name === "JSESSIONID");
    expect(jsession).toBeTruthy();
  });

  test("Fail Case: 400 response shows login failure message", async ({ page }) => {
    await page.route(USER_ME_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unauthorized" }),
      });
    });

    await page.goto(LOCAL_BASE_URL);
    await expect(page.locator(KAKAO_LOGIN_BUTTON_SELECTOR)).toBeVisible();
    await page.locator(KAKAO_LOGIN_BUTTON_SELECTOR).click();
    await expect(page).toHaveURL(KAKAO_AUTH_URL_PATTERN);

    await page.route(LOGIN_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Invalid code",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/kakao?code=invalid-code`);

    await expect(page.getByText("Login failed")).toBeVisible();
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/`);
  });

  test("Fail Case: 401 response shows session-expired feedback", async ({ page }) => {
    await page.route(USER_ME_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unauthorized" }),
      });
    });

    await page.goto(LOCAL_BASE_URL);
    await expect(page.locator(KAKAO_LOGIN_BUTTON_SELECTOR)).toBeVisible();
    await page.locator(KAKAO_LOGIN_BUTTON_SELECTOR).click();
    await expect(page).toHaveURL(KAKAO_AUTH_URL_PATTERN);

    await page.route(LOGIN_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Session expired",
        }),
      });
    });

    await page.goto(`${LOCAL_BASE_URL}/kakao?code=expired-session-code`);

    await expect(page.getByText("Session expired")).toBeVisible();
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/`);
  });
});
