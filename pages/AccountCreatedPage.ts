import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountCreatedPage extends BasePage {
  static readonly url = "/account_created";
  readonly successMessage: Locator;
  readonly continueButton: Locator;
  constructor(page: Page) {
    super(page);
    this.successMessage = page.locator("b", { hasText: "Account Created!" });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async getCurrentUrl() {
    return this.page.url();
  }
  async getTitle() {
    return this.page.title();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
