import test, { expect } from "playwright/test";
import { AllProductsPage } from "../pages/AllProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";

test.describe("Product Details", () => {
  let allProductsPage: AllProductsPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    allProductsPage = new AllProductsPage(page);
    productDetailPage = new ProductDetailPage(page);

    await allProductsPage.goto();
    await allProductsPage.getViewProductLink("1").click();
    await expect(page).toHaveURL("/product_details/1");
  });

  test("should display all product details", async () => {
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
    await expect(productDetailPage.productCategory).toBeVisible();
    await expect(productDetailPage.productAvailability).toBeVisible();

    const productName = await productDetailPage.getProductName();
    const productPrice = await productDetailPage.getProductPrice();

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
  });

  test("should allow quantity modification", async () => {
    const initialQuantity = await productDetailPage.getQuantity();
    expect(initialQuantity).toBe(1);

    await productDetailPage.setQuantity(5);
    const newQuantity = await productDetailPage.getQuantity();
    expect(newQuantity).toBe(5);
  });

  test("should show modal after adding to cart", async () => {
    await productDetailPage.addToCartButton.click();

    await expect(productDetailPage.addToCartModal).toBeVisible();
    await expect(productDetailPage.modalContinueButton).toBeVisible();
    await expect(productDetailPage.modalViewCartLink).toBeVisible();

    await productDetailPage.modalContinueButton.click();
    await expect(productDetailPage.addToCartModal).toBeHidden();
  });
});
