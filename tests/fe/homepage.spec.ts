import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";

test.describe("Home Page Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goTo();
  });

  test("should have title Automaton excerise", async () => {
    await expect(homePage.getTitle()).resolves.toBe("Automation Exercise");
  });

  test("should display the header with logo and navigation links", async ({}) => {
    const header = homePage.header;
    await expect(header.logo).toBeVisible();
    await expect(header.homeLink).toBeVisible();
    await expect(header.productsLink).toBeVisible();
    await expect(header.cartLink).toBeVisible();
    await expect(header.signUpAndLoginLink).toBeVisible();
    await expect(header.contactUsLink).toBeVisible();
  });

  test("first product name sohuld be Blue Top", async () => {
    const firstProductName = await homePage.getFirstProductName();
    expect(firstProductName).toBe("Blue Top");
  });
});
