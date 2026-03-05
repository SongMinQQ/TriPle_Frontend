const { expect, test } = require("@playwright/test");

const LOCAL_BASE_URL = "https://localhost:3000";

const USER_ME_API_PATTERN = "**/users/me";
const GROUP_CREATE_API_PATTERN = "**/groups";
const FILE_UPLOAD_PRESIGN_API_PATTERN = "**/files/upload-presign";
const FILE_UPLOAD_COMPLETE_API_PATTERN = "**/files/upload-complete";

const TEST_GROUP_NAME = "테스트그룹";
const TEST_GROUP_DESCRIPTION = "그룹이 잘 만들어지는지 테스트 진행중";
const TEST_MEMBER_LIMIT = 20;
const TEST_GROUP_KIND = "PUBLIC";
const TEST_IMAGE_PATH = "public/TriPle_logo_sm.png";
const PENDING_KEY = "uploads/pending/1/TriPle_logo_sm.png";
const UPLOADED_KEY = "uploads/uploaded/1/TriPle_logo_sm.png";
const UPLOADED_URL =
  "https://triple-dev-s3.s3.ap-northeast-2.amazonaws.com/uploads/uploaded/1/TriPle_logo_sm.png";
const MOCK_PRESIGNED_URL = `${LOCAL_BASE_URL}/mock-presigned-put`;
const CSRF_STORAGE_KEY = "auth.csrf.token";
const CSRF_TOKEN = "csrf-token-from-login";

const seedCsrfToken = async (page) => {
  await page.addInitScript(
    ({ key, token }) => {
      window.sessionStorage.setItem(key, token);
    },
    { key: CSRF_STORAGE_KEY, token: CSRF_TOKEN }
  );
};

const fillGroupCreateForm = async (page) => {
  await page.goto(`${LOCAL_BASE_URL}/group/create`);

  await page.locator("#group-name").fill(TEST_GROUP_NAME);
  await page.locator("#group-desc").fill(TEST_GROUP_DESCRIPTION);

  await page.locator('input[type="range"]').evaluate((input, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(input, String(value));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, TEST_MEMBER_LIMIT);

  await page.getByRole("button", { name: "공개", exact: true }).click();
  await page.getByTestId("group-image-input").setInputFiles(TEST_IMAGE_PATH);
  await page.getByRole("button", { name: "그룹 생성하기" }).click();
};

test.describe("Group create with image upload flow", () => {
  test.use({ ignoreHTTPSErrors: true });

  test("Success Case: 이미지 업로드(발급/PUT/완료) 후 그룹 생성", async ({ page }) => {
    const callOrder = [];
    let groupCreatePayload = null;

    await page.route(USER_ME_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          nickname: "tester",
          gender: "MALE",
          birth: "1999-01-16",
          description: "hello",
          profileUrl: "https://example.com/profile.png",
        }),
      });
    });

    await page.route(FILE_UPLOAD_PRESIGN_API_PATTERN, async (route) => {
      callOrder.push("presign");
      const requestBody = route.request().postDataJSON();
      expect(route.request().headers()["x-csrf-token"]).toBe(CSRF_TOKEN);

      expect(requestBody.presignedUrlRequestDtos).toHaveLength(1);
      expect(requestBody.presignedUrlRequestDtos[0].fileName).toBe("TriPle_logo_sm.png");
      expect(["image/png", "application/octet-stream"]).toContain(
        requestBody.presignedUrlRequestDtos[0].mimeType
      );

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          presignedUrlResponseDtos: [
            {
              fileName: "TriPle_logo_sm.png",
              mimeType: "image/png",
              key: PENDING_KEY,
              presignedUrl: MOCK_PRESIGNED_URL,
              expiresAt: "2030-01-01T00:00:00Z",
              success: true,
              errorCode: null,
              message: null,
            },
          ],
        }),
      });
    });

    await page.route("**/mock-presigned-put", async (route) => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "PUT, OPTIONS",
            "access-control-allow-headers": "content-type",
          },
          body: "",
        });
        return;
      }

      callOrder.push("put");
      expect(method).toBe("PUT");

      await route.fulfill({
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
        },
        body: "",
      });
    });

    await page.route(FILE_UPLOAD_COMPLETE_API_PATTERN, async (route) => {
      callOrder.push("complete");
      const requestBody = route.request().postDataJSON();
      expect(route.request().headers()["x-csrf-token"]).toBe(CSRF_TOKEN);

      expect(requestBody).toEqual({
        keys: [PENDING_KEY],
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          uploadResults: [
            {
              pendingKey: PENDING_KEY,
              uploadedKey: UPLOADED_KEY,
              uploadedUrl: UPLOADED_URL,
              success: true,
              httpStatus: null,
              message: null,
            },
          ],
        }),
      });
    });

    await page.route(GROUP_CREATE_API_PATTERN, async (route) => {
      const request = route.request();
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }

      callOrder.push("create");
      groupCreatePayload = request.postDataJSON();
      expect(request.headers()["x-csrf-token"]).toBe(CSRF_TOKEN);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          groupId: 321,
        }),
      });
    });

    await seedCsrfToken(page);
    await fillGroupCreateForm(page);

    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/group/321`);
    expect(callOrder).toEqual(["presign", "put", "complete", "create"]);
    expect(groupCreatePayload).toEqual({
      name: TEST_GROUP_NAME,
      description: TEST_GROUP_DESCRIPTION,
      memberLimit: TEST_MEMBER_LIMIT,
      groupKind: TEST_GROUP_KIND,
      thumbNailUrl: UPLOADED_URL,
    });
  });

  test("Fail Case: upload-complete 실패 시 그룹 생성 요청이 호출되지 않음", async ({
    page,
  }) => {
    let groupCreateCalled = false;

    await page.route(USER_ME_API_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          nickname: "tester",
          gender: "MALE",
          birth: "1999-01-16",
          description: "hello",
          profileUrl: "https://example.com/profile.png",
        }),
      });
    });

    await page.route(FILE_UPLOAD_PRESIGN_API_PATTERN, async (route) => {
      expect(route.request().headers()["x-csrf-token"]).toBe(CSRF_TOKEN);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          presignedUrlResponseDtos: [
            {
              fileName: "TriPle_logo_sm.png",
              mimeType: "image/png",
              key: PENDING_KEY,
              presignedUrl: MOCK_PRESIGNED_URL,
              expiresAt: "2030-01-01T00:00:00Z",
              success: true,
              errorCode: null,
              message: null,
            },
          ],
        }),
      });
    });

    await page.route("**/mock-presigned-put", async (route) => {
      const method = route.request().method();
      if (method === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "PUT, OPTIONS",
            "access-control-allow-headers": "content-type",
          },
          body: "",
        });
        return;
      }

      await route.fulfill({
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
        },
        body: "",
      });
    });

    await page.route(FILE_UPLOAD_COMPLETE_API_PATTERN, async (route) => {
      expect(route.request().headers()["x-csrf-token"]).toBe(CSRF_TOKEN);
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "upload complete failed",
        }),
      });
    });

    await page.route(GROUP_CREATE_API_PATTERN, async (route) => {
      if (route.request().method() === "POST") {
        groupCreateCalled = true;
      }

      await route.continue();
    });

    await seedCsrfToken(page);
    await fillGroupCreateForm(page);

    expect(groupCreateCalled).toBe(false);
    await expect(page.getByText("그룹 생성 실패", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(`${LOCAL_BASE_URL}/group/create`);
  });
});
