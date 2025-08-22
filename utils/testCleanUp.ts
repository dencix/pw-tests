import { Page, TestInfo } from "playwright/test";
import { CartPage } from "../pages/CartPage";
import { HeaderComponent } from "../pages/Header";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

export async function cleanupAfterTest(
  page: Page,
  homePage: HomePage,
  headerComponent: HeaderComponent,
  loginPage: LoginPage,
  cartPage: CartPage,
  testInfo?: TestInfo,
  onlyOnFailure: boolean = false
) {
  if (onlyOnFailure && testInfo?.status === "passed") {
    return;
  }

  await homePage.goto();

  const isLoggedIn = await headerComponent.isUserLoggedIn();

  if (!isLoggedIn) {
    await headerComponent.clickSignUpAndLogin();

    const email = process.env.TEST_EMAIL!;
    const password = process.env.TEST_PASSWORD!;
    await loginPage.login(email, password);
  }

  await cartPage.removeAllProducts();
  await headerComponent.clickLogout();
}
