import { test, expect } from "@playwright/test";
import { ApiClient } from "../../api/Client";
import { TestDataCreation } from "../../api/testDataCreation";

test.describe("User Lifecycle Integration Tests", () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test("Complete User Lifecycle - CREATE → UPDATE → DELETE", async () => {
    const userData = TestDataCreation.createValidUser();

    const createResult = await apiClient.createAccount(userData);
    const createResponseData = JSON.parse(createResult.text);
    expect(createResponseData.responseCode).toBe(201);
    expect(createResult.text).toContain("User created!");

    const updatedData = {
      ...userData,
      firstName: "UpdatedName",
      company: "New Company",
      city: "New City",
    };
    const updateResult = await apiClient.updateAccount(updatedData);
    const updateResponseData = JSON.parse(updateResult.text);
    expect(updateResponseData.responseCode).toBe(200);
    expect(updateResult.text).toContain("User updated!");

    const deleteResult = await apiClient.deleteAccount(
      userData.email,
      userData.password
    );
    const deleteResponseData = JSON.parse(deleteResult.text);
    expect(deleteResponseData.responseCode).toBe(200);
    expect(deleteResult.text).toContain("Account deleted!");
  });

  test("Multiple Users Lifecycle - Test concurrency", async () => {
    const users = [
      TestDataCreation.createValidUser({ firstname: "User1" }),
      TestDataCreation.createValidUser({ firstname: "User2" }),
      TestDataCreation.createValidUser({ firstname: "User3" }),
    ];

    const createPromises = users.map((user) => apiClient.createAccount(user));
    const createResults = await Promise.all(createPromises);

    for (const result of createResults) {
      const responseData = JSON.parse(result.text);
      expect(responseData.responseCode).toBe(201);
    }

    const updatedUsers = users.map((user) => ({
      ...user,
      company: "Updated Company",
    }));
    const updatePromises = updatedUsers.map((user) =>
      apiClient.updateAccount(user)
    );
    const updateResults = await Promise.all(updatePromises);

    for (const result of updateResults) {
      const responseData = JSON.parse(result.text);
      expect(responseData.responseCode).toBe(200);
    }
    const deletePromises = users.map((user) =>
      apiClient.deleteAccount(user.email, user.password)
    );
    const deleteResults = await Promise.all(deletePromises);

    for (const result of deleteResults) {
      const responseData = JSON.parse(result.text);
      expect(responseData.responseCode).toBe(200);
    }
  });

  test("Error Recovery - Handle partial failures", async () => {
    const userData = TestDataCreation.createValidUser();

    const createResult = await apiClient.createAccount(userData);
    const createResponseData = JSON.parse(createResult.text);
    expect(createResponseData.responseCode).toBe(201);

    const duplicateResult = await apiClient.createAccount(userData);
    const responseData = JSON.parse(duplicateResult.text);
    expect(responseData.responseCode).not.toBe(200);
    expect(responseData.responseCode).toBe(400);

    const updateResult = await apiClient.updateAccount({
      ...userData,
      firstname: "Updated",
    });
    const updateResponseData = JSON.parse(updateResult.text);
    expect(updateResponseData.responseCode).toBe(200);

    const deleteResult = await apiClient.deleteAccount(
      userData.email,
      userData.password
    );
    const deleteResponseData = JSON.parse(deleteResult.text);
    expect(deleteResponseData.responseCode).toBe(200);
  });
});
