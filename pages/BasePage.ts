import { Page } from "@playwright/test";
import { HeaderComponent } from "./Header";

export class BasePage {
  readonly page: Page;
  public readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  async handleConsent() {
    try {
      const consentButton = this.page.locator(".fc-cta-consent");
      if (await consentButton.isVisible({ timeout: 3000 })) {
        await consentButton.click();
        await this.page.waitForSelector(".fc-dialog", {
          state: "hidden",
          timeout: 5000,
        });
      }
    } catch (error) {
      console.log("Consent modal not available or already handled.");
      //Případně error handling/logging
    }
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
    await this.handleConsent();
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
