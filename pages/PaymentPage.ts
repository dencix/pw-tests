import { PaymentInfo } from "../utils/types";
import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class PaymentPage extends BasePage {
  static readonly url = "/payment";

  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly successMessage: Locator;
  readonly paymentForm: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.successMessage = page.locator("#success_message .alert-success");
    this.paymentForm = page.locator("#payment-form");
  }

  async goto() {
    await this.navigateTo(PaymentPage.url);
  }

  async fillPaymentInfo(paymentInfo: PaymentInfo) {
    await this.nameOnCardInput.fill(paymentInfo.nameOnCard);
    await this.cardNumberInput.fill(paymentInfo.cardNumber);
    await this.cvcInput.fill(paymentInfo.cvc);
    await this.expiryMonthInput.fill(paymentInfo.expiryMonth);
    await this.expiryYearInput.fill(paymentInfo.expiryYear);
  }

  async clickPayButton() {
    await this.payButton.click();
  }

  async completePayment(paymentInfo: PaymentInfo) {
    await this.fillPaymentInfo(paymentInfo);
    await this.clickPayButton();
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent()) || "";
  }
}
