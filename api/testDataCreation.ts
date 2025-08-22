import { FullUserData, SignUpFormData } from "../utils/types";

export class TestDataCreation {
  static createValidUser(overrides: Partial<FullUserData> = {}): FullUserData {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);

    return {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}${randomNum}@example.com`,
      password: "TestPassword123!",
      title: "Mr",
      birth_date: "15",
      birth_month: "06",
      birth_year: "1990",
      firstname: "John",
      lastname: "Doe",
      company: "Test Company Ltd",
      address1: "123 Test Street",
      address2: "Apartment 4B",
      country: "India",
      zipcode: "12345",
      state: "California",
      city: "Los Angeles",
      mobile_number: "+1234567890",
      ...overrides,
    };
  }

  static createMinimalUser(): SignUpFormData {
    const timestamp = Date.now();
    return {
      name: `Minimal User ${timestamp}`,
      email: `minimal${timestamp}@example.com`,
      password: "MinimalPass123",
      title: "Mrs",
      firstname: "Jane",
      lastname: "Smith",
      address1: "1 Main St",
      country: "India",
      zipcode: "000000",
      state: "Delhi",
      city: "New Delhi",
      mobile_number: "9876543210",
    };
  }
}
