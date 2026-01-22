import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goTo() {
    await this.navigateTo("/");
  }

  async getTitle() {
    return this.page.title();
  }

  async getFirstProductName(): Promise<string> {
    return (
      (await this.page.locator(".productinfo p").first().textContent()) || ""
    );
  }
}
