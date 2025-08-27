import { Page, TestInfo } from "playwright/test";
import { CartPage } from "../pages/CartPage";
import { HeaderComponent } from "../pages/Header";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

export async function cleanupAfterTest(
  email: string,
  password: string,
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

    await loginPage.login(email, password);
  }

  await cartPage.removeAllProducts();
  await headerComponent.clickLogout();
}
