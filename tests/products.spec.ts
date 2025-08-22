import test, { expect } from "playwright/test";
import { AllProductsPage } from "../pages/AllProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";

test.describe("Product page test", () => {
  let allProductsPage: AllProductsPage;

  test.beforeEach(async ({ page }) => {
    allProductsPage = new AllProductsPage(page);

    await allProductsPage.goto();
  });

  test("should display products page with correct URL and title", async ({
    page,
  }) => {
    await expect(page).toHaveURL(AllProductsPage.url);
    await expect(allProductsPage.title).toBeVisible();
  });

  test("should display product list with items", async () => {
    await expect(allProductsPage.productList).toBeVisible();

    const productCount = await allProductsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const firstProduct = allProductsPage.getProductByIndex(0);
    await expect(firstProduct).toBeVisible();
  });

  test("should navigate to product details when clicking view product", async ({
    page,
  }) => {
    await expect(allProductsPage.productList).toBeVisible();

    await allProductsPage.viewFirstProduct();

    await expect(page).toHaveURL(/\/product_details\/\d+/);

    const productDetailPage = new ProductDetailPage(page);
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();

    const isDetailsVisible = await productDetailPage.isProductDetailsVisible();
    expect(isDetailsVisible).toBe(true);
  });

  test("should display product information correctly", async () => {
    const productCount = await allProductsPage.getProductCount();
    const maxProducts = Math.min(productCount, 3);

    for (let i = 1; i < maxProducts; i++) {
      const productInfo = await allProductsPage.getProductInfoById(
        i.toString()
      );

      expect(productInfo.name).toBeTruthy();
      expect(productInfo.priceText).toBeTruthy();
      expect(productInfo.priceText).toMatch(/Rs\.\s*\d+/);
      expect(typeof productInfo.price).toBe("number");
    }
  });

  test("should have visible add to cart buttons", async () => {
    const addToCartButton = allProductsPage.getAddToCartButton("1");
    await expect(addToCartButton).toBeVisible();
  });

  test("should show modal after adding to cart", async () => {
    await allProductsPage.getAddToCartButton("1").click();

    await expect(allProductsPage.addToCartModal).toBeVisible();
    await expect(allProductsPage.modalContinueButton).toBeVisible();
    await expect(allProductsPage.modalViewCartLink).toBeVisible();

    await allProductsPage.modalContinueButton.click();
    await expect(allProductsPage.addToCartModal).toBeHidden();
  });
});

test.describe("Product Detail Navigation", () => {
  test("should show specific product details after navigation", async ({
    page,
  }) => {
    const allProductsPage = new AllProductsPage(page);
    await allProductsPage.goto();

    await allProductsPage.getViewProductLink("1").click();

    await expect(page).toHaveURL("/product_details/1");

    const productDetailPage = new ProductDetailPage(page);

    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
    await expect(productDetailPage.productCategory).toBeVisible();
    await expect(productDetailPage.productAvailability).toBeVisible();

    const productName = await productDetailPage.getProductName();
    const productPrice = await productDetailPage.getProductPrice();

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
  });
  test("should show modal after adding product to cart from product details", async ({
    page,
  }) => {
    const allProductsPage = new AllProductsPage(page);
    await allProductsPage.goto();

    await allProductsPage.getViewProductLink("1").click();

    await expect(page).toHaveURL("/product_details/1");

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.addToCartButton.click();

    await expect(productDetailPage.addToCartModal).toBeVisible();
    await expect(productDetailPage.modalContinueButton).toBeVisible();
    await expect(productDetailPage.modalViewCartLink).toBeVisible();

    await productDetailPage.modalContinueButton.click();
  });

  test("should add product with specific quantity and verify total", async ({
    page,
  }) => {
    const allProductsPage = new AllProductsPage(page);
    const cartPage = new CartPage(page);

    await allProductsPage.goto();
    await allProductsPage.getViewProductLink("1").click();

    const productDetailPage = new ProductDetailPage(page);

    const testQuantity = 3;
    await productDetailPage.addToCartWithQuantity(testQuantity);

    await cartPage.goto();
    const cartQuantity = await cartPage.getTotalQuantity();
    expect(cartQuantity).toBe(testQuantity);
  });
});
