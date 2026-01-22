import { parsePrice } from "../utils/parsePrice";
import { BasePage } from "./BasePage";
import { Page, Locator, expect } from "@playwright/test";

export class AllProductsPage extends BasePage {
  static readonly url = "/products";
  readonly productList: Locator;
  readonly title: Locator;
  readonly productItems: Locator;
  readonly addToCartModal: Locator;
  readonly modalContinueButton: Locator;
  readonly modalViewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole("heading", { name: "All Products" });
    this.productList = page.locator(".features_items");
    this.productItems = page.locator(".product-image-wrapper");
    this.addToCartModal = page.locator(".modal-content");
    this.modalContinueButton = page.locator(".close-modal");
    this.modalViewCartLink = page.locator('.modal-body a[href="/view_cart"]');
  }

  async goTo() {
    await this.navigateTo(AllProductsPage.url);
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  getProductByIndex(index: number): Locator {
    return this.productItems.nth(index);
  }

  getProductById(productId: string): Locator {
    return this.page
      .locator(`[data-product-id="${productId}"]`)
      .locator('xpath=ancestor::div[contains(@class, "product-image-wrapper")]')
      .first();
  }

  getViewProductLink(productId: string): Locator {
    return this.page.locator(`a[href="/product_details/${productId}"]`);
  }

  getViewProductLinkByIndex(index: number): Locator {
    return this.productItems.nth(index).locator('a[href^="/product_details/"]');
  }

  getViewProductLinkById(productId: string): Locator {
    return this.page
      .locator(`[data-product-id="${productId}"]`)
      .locator('xpath=ancestor::div[contains(@class, "product-image-wrapper")]')
      .locator('a[href^="/product_details/"]')
      .first();
  }
  async getProductPrice(productId: string): Promise<number> {
    const productWrapper = this.getProductById(productId);
    const priceText =
      (await productWrapper.locator(".productinfo h2").textContent()) || "";
    return parsePrice(priceText);
  }

  get firstViewProductLink(): Locator {
    return this.page.locator('a[href^="/product_details/"]').first();
  }

  async viewFirstProduct() {
    await this.firstViewProductLink.click();
  }

  async viewProductByIndex(index: number) {
    await this.getViewProductLinkByIndex(index).click();
  }

  async viewProductById(productId: string) {
    const viewLink = this.getViewProductLinkById(productId);
    await viewLink.waitFor({ state: "visible" });
    await viewLink.click();
  }

  async viewProductByIdDirect(productId: string) {
    const viewLink = this.getViewProductLink(productId);
    await viewLink.waitFor({ state: "visible" });
    await viewLink.click();
  }

  async getProductInfoById(
    productId: string
  ): Promise<{ name: string; price: number; priceText: string }> {
    const productWrapper = this.getProductById(productId);
    const name =
      (await productWrapper.locator(".productinfo p").textContent()) || "";
    const priceText =
      (await productWrapper.locator(".productinfo h2").textContent()) || "";

    const cleanPrice = priceText.replace(/[^\d.]/g, "");
    const price = parseFloat(cleanPrice) || 0;

    return { name, price, priceText };
  }

  getAddToCartButton(productId: string): Locator {
    return this.page
      .locator(`[data-product-id="${productId}"].btn.btn-default.add-to-cart`)
      .first();
  }

  async addToCart(productId: string) {
    await this.getAddToCartButton(productId).click();
    await this.modalContinueButton.waitFor({ state: "visible" });
    await this.modalContinueButton.click();
    await this.addToCartModal.waitFor({ state: "hidden" });
  }

  async addToCartAndViewCart(productId: string) {
    await this.getAddToCartButton(productId).click();
    await this.modalViewCartLink.waitFor({ state: "visible" });
    await this.modalViewCartLink.click();
  }

  async addMultipleProductsToCart(productIds: string[]) {
    for (const productId of productIds) {
      await this.addToCart(productId);
    }
  }

  async hoverOverProduct(productId: string) {
    const productWrapper = this.getProductById(productId);
    await productWrapper.hover();
  }
}
