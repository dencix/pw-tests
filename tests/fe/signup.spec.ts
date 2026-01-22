import test, { expect } from "playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { SignUpPage } from "../../pages/SignupPage";
import { AccountCreatedPage } from "../../pages/AccountCreatedPage";
import { SignUpFormData } from "../../utils/types";

function generateUniqueUserData(): SignUpFormData {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  const uniqueId = `${timestamp}${randomId}`;

  return {
    title: "Mr",
    name: `testuser${uniqueId}`,
    email: `test${uniqueId}@tdh.cz`,
    password: "testpassword",
    firstname: "John",
    lastname: "Doe",
    address1: "123 Main Street",
    country: "United States",
    state: "California",
    city: "Los Angeles",
    zipcode: "90210",
    mobile_number: "+1234567890",
  };
}

test.describe("Signup Page Tests", () => {
  let loginPage: LoginPage;
  let signUpPage: SignUpPage;
  let formData: SignUpFormData;
  let controlUsername: string;
  let duplicityEmail: string;

  test.beforeEach(async ({ page }) => {
    formData = generateUniqueUserData();
    controlUsername = formData.name;
    loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test("should display pre-signup form", async () => {
    await expect(loginPage.signUpName).toBeVisible();
    await expect(loginPage.signUpEmail).toBeVisible();
    await expect(loginPage.signUpButton).toBeVisible();
  });

  test("should sign up with valid data", async ({ page }) => {
    signUpPage = await loginPage.preSignUp(formData.name, formData.email);
    await signUpPage.signUp(formData);
    await expect(page).toHaveURL(AccountCreatedPage.url);
  });

  test("signup should fail with duplicity email", async () => {
    duplicityEmail = process.env.EMAIL || "test@tdh.cz";
    signUpPage = await loginPage.preSignUp("test user", duplicityEmail);
    await expect(loginPage.errorSignUp).toBeVisible();
  });
});
