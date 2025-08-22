import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";
import { SignUpPage } from "./SignupPage";

export class LoginPage extends BasePage {
  static readonly url = "/login";
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorElement: Locator;
  readonly signUpName: Locator;
  readonly signUpEmail: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.errorElement = page.locator(
      'p:has-text("Your email or password is incorrect!")'
    );
    this.signUpName = page.locator('[data-qa="signup-name"]');
    this.signUpEmail = page.locator('[data-qa="signup-email"]');
    this.signUpButton = page.locator('[data-qa="signup-button"]');
  }

  async goto() {
    await this.navigateTo(LoginPage.url);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async preSignUp(email: string, password: string) {
    await this.signUpName.fill(email);
    await this.signUpEmail.fill(password);
    await this.signUpButton.click();
    await this.page.waitForURL("/signup");
    return new SignUpPage(this.page);
  }
}
