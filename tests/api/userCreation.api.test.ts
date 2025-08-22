import { test, expect } from "@playwright/test";
import { ApiClient } from "../../api/Client";
import { TestDataCreation } from "../../api/testDataCreation";
import { Country } from "../../utils/types";

test.describe("User Creation API Tests", () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test("POST /createAccount - Should create user with valid full data", async () => {
    const userData = TestDataCreation.createValidUser();

    const result = await apiClient.createAccount(userData);
    const responseData = JSON.parse(result.text);

    expect(responseData.responseCode).toBe(201);
    expect(result.text).toContain("User created!");

    await apiClient.deleteAccount(userData.email, userData.password);
  });

  test("POST /createAccount - Should create user with minimal data", async () => {
    const userData = TestDataCreation.createMinimalUser();

    const result = await apiClient.createAccount(userData);
    const responseData = JSON.parse(result.text);

    expect(responseData.responseCode).toBe(201);
    expect(result.text).toContain("User created!");

    await apiClient.deleteAccount(userData.email, userData.password);
  });

  test("POST /createAccount - Should create users with different titles", async () => {
    const titles = ["Mr", "Mrs"] as const;

    for (const title of titles) {
      const userData = TestDataCreation.createValidUser({ title });

      const result = await apiClient.createAccount(userData);
      const responseData = JSON.parse(result.text);

      expect(responseData.responseCode).toBe(201);
      expect(result.text).toContain("User created!");

      await apiClient.deleteAccount(userData.email, userData.password);
    }
  });

  test("POST /createAccount - Should create users from different countries", async () => {
    const countries: Country[] = ["India", "Israel", "Canada"];

    for (const country of countries) {
      const userData = TestDataCreation.createValidUser({ country });

      const result = await apiClient.createAccount(userData);
      const responseData = JSON.parse(result.text);

      expect(responseData.responseCode).toBe(201);
      expect(result.text).toContain("User created!");

      await apiClient.deleteAccount(userData.email, userData.password);
    }
  });

  test("POST /createAccount - Should not create a user with same email", async () => {
    const timestamp = Date.now();
    const duplicityEmail = `test.${timestamp}@test.cz`;

    const userData1 = TestDataCreation.createValidUser({
      email: duplicityEmail,
    });
    const userData2 = TestDataCreation.createValidUser({
      email: duplicityEmail,
    });

    const firstResult = await apiClient.createAccount(userData1);
    const firstResponseData = JSON.parse(firstResult.text);
    expect(firstResponseData.responseCode).toBe(201);

    const duplicateResult = await apiClient.createAccount(userData2);
    const responseData = JSON.parse(duplicateResult.text);

    expect(responseData.responseCode).not.toBe(200);
    expect(responseData.responseCode).toBe(400);
    expect(responseData.message).toContain("Email already exists!");

    await apiClient.deleteAccount(userData1.email, userData1.password);
  });

  test("POST /createAccount - Should reject invalid email formats", async () => {
    const invalidEmails = [
      "invalid-email",
      "@test.com",
      "test@",
      "test.com",
      "",
    ];

    for (const email of invalidEmails) {
      const userData = TestDataCreation.createValidUser({ email });

      const result = await apiClient.createAccount(userData);
      const responseData = JSON.parse(result.text);

      expect(responseData.responseCode).not.toBe(201);
    }
  });
});
