import { parsePrice } from "../utils/parsePrice";
import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productCategory: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addToCartModal: Locator;
  readonly modalContinueButton: Locator;
  readonly modalViewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator(".product-information h2");
    this.productPrice = page.locator(".product-information span span");
    this.productCategory = page.locator(
      '.product-information p:has-text("Category:")'
    );
    this.productAvailability = page.locator(
      '.product-information p:has-text("Availability:")'
    );
    this.productCondition = page.locator(
      '.product-information p:has-text("Condition:")'
    );
    this.productBrand = page.locator(
      '.product-information p:has-text("Brand:")'
    );
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = page.locator(".btn.btn-default.cart");
    this.addToCartModal = page.locator(".modal-content");
    this.modalContinueButton = page.locator(".close-modal");
    this.modalViewCartLink = page.locator('.modal-body a[href="/view_cart"]');
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) || "";
  }

  async getProductPrice(): Promise<number> {
    const priceText = (await this.productPrice.textContent()) || "";
    return parsePrice(priceText);
  }

  async isProductDetailsVisible(): Promise<boolean> {
    return (
      (await this.productName.isVisible()) &&
      (await this.productPrice.isVisible())
    );
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async getQuantity(): Promise<number> {
    const value = await this.quantityInput.inputValue();
    return parseInt(value) || 1;
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.modalContinueButton.waitFor({ state: "visible" });
    await this.modalContinueButton.click();
    await this.addToCartModal.waitFor({ state: "hidden" });
  }

  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  async addToCartAndViewCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.modalViewCartLink.waitFor({ state: "visible" });
    await this.modalViewCartLink.click();
  }
}
