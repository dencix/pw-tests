import test, { expect } from "playwright/test";
import { CartPage } from "../../pages/CartPage";
import { AllProductsPage } from "../../pages/AllProductsPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { LoginPage } from "../../pages/LoginPage";
import { HeaderComponent } from "../../pages/Header";
import { cleanupAfterTest } from "../../utils/testCleanUp";
import { HomePage } from "../../pages/HomePage";

test.describe("Add to Cart and Cart Management", () => {
  let cartPage: CartPage;
  let allProductsPage: AllProductsPage;
  let productDetailPage: ProductDetailPage;
  let loginPage: LoginPage;
  let headerComponent: HeaderComponent;
  let homePage: HomePage;
  const email = process.env.TEST_EMAIL2!;
  const password = process.env.TEST_PASSWORD2!;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    allProductsPage = new AllProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
    loginPage = new LoginPage(page);
    headerComponent = new HeaderComponent(page);
    homePage = new HomePage(page);
  });

  test.afterEach(async () => {
    await cleanupAfterTest(
      email,
      password,
      homePage,
      headerComponent,
      loginPage,
      cartPage
    );
  });

  test.describe("Add to Cart Functionality", () => {
    test("should add product from product listing page", async () => {
      await allProductsPage.goto();
      await allProductsPage.getAddToCartButton("1").click();

      await expect(allProductsPage.addToCartModal).toBeVisible();
      await expect(allProductsPage.modalContinueButton).toBeVisible();
      await expect(allProductsPage.modalViewCartLink).toBeVisible();

      await allProductsPage.modalContinueButton.click();
      await expect(allProductsPage.addToCartModal).toBeHidden();
    });

    test("should add product with custom quantity from product details", async ({
      page,
    }) => {
      await allProductsPage.goto();
      await allProductsPage.getViewProductLink("1").click();

      const testQuantity = 3;
      await productDetailPage.addToCartWithQuantity(testQuantity);

      await cartPage.goto();
      const cartQuantity = await cartPage.getTotalQuantity();
      expect(cartQuantity).toBe(testQuantity);
    });

    test("should navigate directly to cart from modal", async ({ page }) => {
      await allProductsPage.goto();
      await allProductsPage.addToCartAndViewCart("1");

      await expect(page).toHaveURL(CartPage.url);

      const itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(1);
    });
  });

  test.describe("Cart Management", () => {
    test("should display empty cart", async ({ page }) => {
      await cartPage.goto();
      await expect(page).toHaveURL(CartPage.url);
      await expect(cartPage.emptyCart).toBeVisible();

      const itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(0);
    });

    test("should display multiple cart items", async ({ page }) => {
      await allProductsPage.goto();
      await allProductsPage.addToCart("1");
      await allProductsPage.addToCart("2");

      await cartPage.goto();
      const itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(2);

      const totalQuantity = await cartPage.getTotalQuantity();
      expect(totalQuantity).toBe(2);
    });

    test("should calculate total price correctly", async ({ page }) => {
      await allProductsPage.goto();
      await allProductsPage.addToCart("1");
      await allProductsPage.addToCart("1");

      await cartPage.goto();

      const totalQuantity = await cartPage.getTotalQuantity();
      expect(totalQuantity).toBe(2);

      const totalPrice = await cartPage.getTotalPrice();
      expect(totalPrice).toBeGreaterThan(0);
    });

    test("should remove items from cart", async ({ page }) => {
      await allProductsPage.goto();
      await allProductsPage.addToCart("1");

      await cartPage.goto();
      let itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(1);

      await cartPage.removeProductById("1");

      await page.waitForTimeout(1000);
      itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(0);
    });

    test("should show login modal when clicking checkout without being logged in", async ({
      page,
    }) => {
      await allProductsPage.goto();
      await allProductsPage.addToCart("1");

      await cartPage.goto();

      await expect(cartPage.checkoutButton).toBeVisible();
      await cartPage.clickCheckout();

      const loginModal = page.locator(".modal-content");
      await expect(loginModal).toBeVisible();

      const modalTitle = page.locator('.modal-title:has-text("Checkout")');
      await expect(modalTitle).toBeVisible();

      const modalMessage = page.locator(
        '.modal-body p:has-text("Register / Login account to proceed on checkout.")'
      );
      await expect(modalMessage).toBeVisible();

      const loginLink = page.locator(
        '.modal-body a[href="/login"]:has-text("Register / Login")'
      );
      await expect(loginLink).toBeVisible();

      const continueButton = page.locator(
        '.btn.btn-success.close-checkout-modal:has-text("Continue On Cart")'
      );
      await expect(continueButton).toBeVisible();
    });

    test("should proceed to checkout when logged in", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(email, password);

      await expect(headerComponent.loggedInUser).toBeVisible();

      await allProductsPage.goto();
      await allProductsPage.addToCart("1");

      await cartPage.goto();

      await expect(cartPage.checkoutButton).toBeVisible();
      await cartPage.clickCheckout();
      await expect(page).toHaveURL("/checkout");
    });

    test("should handle multiple quantities of same product", async ({
      page,
    }) => {
      await allProductsPage.goto();

      const productIds = ["1", "1", "1"];
      await allProductsPage.addMultipleProductsToCart(productIds);

      await cartPage.goto();

      const totalQuantity = await cartPage.getTotalQuantity();
      expect(totalQuantity).toBe(3);
    });
  });
});
