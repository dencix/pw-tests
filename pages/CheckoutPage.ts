import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class CheckoutPage extends BasePage {
  static readonly url = "/checkout";

  readonly placeOrderButton: Locator;
  readonly totalAmountPrice: Locator;
  readonly orderCommentTextarea: Locator;

  constructor(page: Page) {
    super(page);
    this.placeOrderButton = page.locator('a[href="/payment"].btn.check_out');
    this.totalAmountPrice = page.locator(
      "#cart_info tbody tr:last-child .cart_total_price"
    );
    this.orderCommentTextarea = page.locator('textarea[name="message"]');
  }

  async goTo() {
    await this.navigateTo(CheckoutPage.url);
  }

  async getTotalAmount(): Promise<number> {
    const totalText = (await this.totalAmountPrice.textContent()) || "";
    const digits = totalText.match(/\d+/g);
    return digits ? Number(digits.join("")) : 0;
  }
  async addOrderComment(comment: string) {
    await this.orderCommentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}
