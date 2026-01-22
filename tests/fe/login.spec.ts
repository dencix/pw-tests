import test, { expect } from "playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Page Tests", () => {
  let loginPage: LoginPage;
  const controlUsername = "Test";
  const email = process.env.TEST_EMAIL3!;
  const password = process.env.TEST_PASSWORD3!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test("should display login form", async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("login with invalid credentials should show error", async () => {
    await loginPage.login("test@invalid.cz", "wrongpassword");
    await expect(loginPage.errorElement).toBeVisible();
  });

  test("should login with valid credentials", async () => {
    await loginPage.login(email, password);

    await expect(loginPage.header.loggedInUser).toBeVisible();

    const username = await loginPage.header.getLoggedInUsername();
    expect(username).toBe(controlUsername);
  });
});
