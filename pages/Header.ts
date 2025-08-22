import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signUpAndLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly loggedInUser: Locator;
  readonly logoutLink: Locator;

  constructor(private page: Page) {
    this.logo = page.locator(".logo.pull-left");
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.productsLink = page.getByRole("link", { name: "Products" });
    this.cartLink = page.getByRole("link", { name: "Cart" });
    this.signUpAndLoginLink = page.getByRole("link", {
      name: " Signup / Login",
    });
    this.contactUsLink = page.getByRole("link", { name: "Contact us" });
    this.loggedInUser = page.locator("a:has(i.fa.fa-user)");
    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  async clickLogo() {
    await this.logo.click();
  }

  async clickHome() {
    await this.homeLink.click();
  }

  async clickProducts() {
    await this.productsLink.click();
  }

  async clickCart() {
    await this.cartLink.click();
  }

  async clickSignUpAndLogin() {
    await this.signUpAndLoginLink.click();
  }

  async clickContactUs() {
    await this.contactUsLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async getLoggedInUsername(): Promise<string> {
    const userElement = this.page.locator("a:has(i.fa.fa-user) b");
    return (await userElement.textContent()) || "";
  }

  async isUserLoggedIn(): Promise<boolean> {
    try {
      return await this.loggedInUser.isVisible();
    } catch {
      return false;
    }
  }

  async logout() {
    if (await this.logoutLink.isVisible()) {
      await this.logoutLink.click();
    }
  }
}
