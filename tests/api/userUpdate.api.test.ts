import { test, expect } from "@playwright/test";
import { ApiClient } from "../../api/Client";
import { TestDataCreation } from "../../api/testDataCreation";

test.describe("User Update API Tests", () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test("PUT /updateAccount - Should update existing user successfully", async () => {
    const userData = TestDataCreation.createValidUser();
    const createResult = await apiClient.createAccount(userData);
    const createResponseData = JSON.parse(createResult.text);
    expect(createResponseData.responseCode).toBe(201);

    const updatedData = {
      ...userData,
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      city: "Updated City",
      company: "Updated Company Inc.",
    };

    const updateResult = await apiClient.updateAccount(updatedData);
    const updateResponseData = JSON.parse(updateResult.text);

    expect(updateResponseData.responseCode).toBe(200);
    expect(updateResult.text).toContain("User updated!");

    await apiClient.deleteAccount(userData.email, userData.password);
  });

  test("PUT /updateAccount - Should update multiple fields at once", async () => {
    const userData = TestDataCreation.createValidUser();
    await apiClient.createAccount(userData);

    const updatedData = {
      ...userData,
      firstName: "NewFirst",
      lastName: "NewLast",
      company: "New Company",
      address1: "New Address 123",
      city: "New City",
      state: "New State",
      zipcode: "99999",
      mobileNumber: "+9999999999",
    };

    const result = await apiClient.updateAccount(updatedData);
    const responseData = JSON.parse(result.text);

    expect(responseData.responseCode).toBe(200);
    expect(result.text).toContain("User updated!");

    await apiClient.deleteAccount(userData.email, userData.password);
  });

  test("PUT /updateAccount - Should return error 404 for non-existent user", async () => {
    const nonExistentUserData = TestDataCreation.createValidUser({
      email: "nonexistent@test.com",
    });

    const result = await apiClient.updateAccount(nonExistentUserData);
    const responseData = JSON.parse(result.text);

    expect(responseData.responseCode).toBe(404);
  });
});
