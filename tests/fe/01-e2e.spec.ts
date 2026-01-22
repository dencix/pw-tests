import test, { expect } from "playwright/test";
import { AllProductsPage } from "../../pages/AllProductsPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { LoginPage } from "../../pages/LoginPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { PaymentPage } from "../../pages/PaymentPage";
import { HeaderComponent } from "../../pages/Header";
import { CartPage } from "../../pages/CartPage";
import { paymentInfo } from "../../utils/testData";
import { HomePage } from "../../pages/HomePage";
import { cleanupAfterTest } from "../../utils/testCleanUp";

test.describe("Product Details", () => {
  let allProductsPage: AllProductsPage;
  let homePage: HomePage;
  let productDetailPage: ProductDetailPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  let headerComponent: HeaderComponent;
  let cartPage: CartPage;
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    allProductsPage = new AllProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);
    headerComponent = new HeaderComponent(page);

    homePage = new HomePage(page);
  });

  test.afterEach(async ({}, testInfo) => {
    await cleanupAfterTest(
      email,
      password,
      homePage,
      headerComponent,
      loginPage,
      cartPage,
      testInfo,
      true
    );
  });

  test("Happy path e2e test - login, go to products, show detail, add to cart, checkout, log out", async ({
    page,
  }) => {
    await homePage.goTo();
    await headerComponent.clickSignUpAndLogin();
    await expect(page).toHaveURL(LoginPage.url);

    await loginPage.login(email, password);
    await expect(loginPage.header.loggedInUser).toBeVisible();

    await headerComponent.clickProducts();
    await expect(page).toHaveURL(AllProductsPage.url);
    await expect(allProductsPage.title).toBeVisible();

    await allProductsPage.viewProductById("8");
    await expect(productDetailPage.productName).toBeVisible();
    const quantity = 2;
    await productDetailPage.addToCartWithQuantity(quantity);
    const firstProductPrice =
      (await productDetailPage.getProductPrice()) * quantity;
    await headerComponent.clickProducts();
    await expect(page).toHaveURL(AllProductsPage.url);

    await allProductsPage.viewProductById("3");
    await expect(productDetailPage.productName).toBeVisible();
    const secondProductPrice = await productDetailPage.getProductPrice();
    await productDetailPage.addToCartAndViewCart();

    await expect(page).toHaveURL(CartPage.url);
    await expect(cartPage.cartTable).toBeVisible();

    const totalQuantity = await cartPage.getTotalQuantity();
    await expect(totalQuantity).toBe(quantity + 1);
    let expectedTotal = firstProductPrice + secondProductPrice;
    await expect(expectedTotal).toBe(await cartPage.getTotalPrice());

    await cartPage.removeProductById("3");
    expectedTotal = firstProductPrice;
    await expect(await cartPage.getTotalPrice()).toBe(expectedTotal);

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(CheckoutPage.url);
    await checkoutPage.totalAmountPrice.scrollIntoViewIfNeeded();
    await expect(checkoutPage.totalAmountPrice).toBeVisible();

    let checkoutTotal = await checkoutPage.getTotalAmount();

    await expect(checkoutTotal).toBeTruthy();
    await expect(checkoutTotal).toBe(expectedTotal);

    await checkoutPage.clickPlaceOrder();
    await expect(page).toHaveURL(PaymentPage.url);
    await paymentPage.completePayment(paymentInfo);

    await expect(page).toHaveURL(/\/payment_done/);
    await expect(page.locator('[data-qa="order-placed"]')).toHaveText(
      "Order Placed!"
    );
    await expect(
      page.locator("text=Congratulations! Your order has been confirmed!")
    ).toBeVisible();
    await expect(page.locator('a:has-text("Download Invoice")')).toBeVisible();
    await headerComponent.clickLogout();
    await expect(page).toHaveURL("/login");
  });
});
