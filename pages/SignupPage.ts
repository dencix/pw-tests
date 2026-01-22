import { Sign } from "crypto";
import { BasePage } from "./BasePage";
import { Locator, Page } from "@playwright/test";
import { SignUpFormData } from "../utils/types";

export class SignUpPage extends BasePage {
  readonly genderMr: Locator;
  readonly genderMrs: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMr = page.locator("#id_gender1");
    this.genderMrs = page.locator("#id_gender2");
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.submitButton = page.locator('[data-qa="create-account"]');
  }

  async goTo() {
    await this.navigateTo("/signup");
  }

  async fillSignUpForm(formData: SignUpFormData) {
    const {
      title,
      name,
      email,
      password,
      firstname,
      lastname,
      address1,
      country,
      state,
      city,
      zipcode,
      mobile_number,
    } = formData;

    await this.selectGender(title);
    await this.passwordInput.fill(password);
    await this.firstNameInput.fill(firstname);
    await this.lastNameInput.fill(lastname);

    await this.addressInput.fill(address1);
    await this.countrySelect.selectOption(country);
    await this.stateInput.fill(state);
    await this.cityInput.fill(city);
    await this.zipcodeInput.fill(zipcode);
    await this.mobileNumberInput.fill(mobile_number);
  }

  async selectGender(gender: "Mr" | "Mrs") {
    if (gender === "Mr") {
      await this.genderMr.check();
    } else {
      await this.genderMrs.check();
    }
  }
  async selectCountry(country: string) {
    await this.countrySelect.selectOption({ label: country });
  }
  async submitForm() {
    await this.submitButton.click();
  }
  async signUp(formData: SignUpFormData) {
    await this.fillSignUpForm(formData);
    await this.submitForm();
  }

  async getSelectedGender(): Promise<"Mr" | "Mrs" | ""> {
    if (await this.genderMr.isChecked()) {
      return "Mr";
    }
    if (await this.genderMrs.isChecked()) {
      return "Mrs";
    }
    return "";
  }
  async getSelectedCountry(): Promise<SignUpFormData["country"]> {
    return (await this.countrySelect.inputValue()) as SignUpFormData["country"];
  }
}
