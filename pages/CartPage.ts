import { parsePrice } from "../utils/parsePrice";
import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class CartPage extends BasePage {
  static readonly url = "/view_cart";
  readonly checkoutButton: Locator;
  readonly emptyCart: Locator;
  readonly cartTable: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator("a.btn.btn-default.check_out");
    this.emptyCart = page.locator(
      "p:has-text('Cart is empty! Click here to buy products.')"
    );
    this.cartTable = page.locator("#cart_info_table");
    this.cartItems = page.locator("#cart_info_table tbody tr");
  }

  async goto() {
    await this.navigateTo(CartPage.url);
  }

  async getTotalPrice(): Promise<number> {
    const items = await this.cartItems.all();
    let total = 0;

    for (const item of items) {
      const text =
        (await item.locator(".cart_total_price").textContent()) || "";
      total += parsePrice(text);
    }

    return total;
  }

  async getTotalQuantity(): Promise<number> {
    const items = await this.cartItems.all();
    let totalQuantity = 0;

    for (const item of items) {
      const quantityText =
        (await item.locator(".cart_quantity button").textContent()) || "0";
      const quantity = parseInt(quantityText) || 0;
      totalQuantity += quantity;
    }

    return totalQuantity;
  }

  async removeProductById(productId: string): Promise<void> {
    const row = this.page.locator(
      `#cart_info_table [data-product-id="${productId}"]`
    );
    await row.click();
    await row.waitFor({ state: "detached" });
  }

  async removeAllProducts(): Promise<void> {
    await this.goto();

    const itemCount = await this.cartItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(0);
      const productId = await item
        .locator("[data-product-id]")
        .getAttribute("data-product-id");

      if (productId) {
        await this.removeProductById(productId);
        await this.page.waitForTimeout(500);
      }
    }
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
