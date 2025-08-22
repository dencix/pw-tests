import { test, expect } from "@playwright/test";
import { ApiClient } from "../../api/Client";
import { Product } from "../../utils/types";

//TODO - refactor using zod

test.describe("Products API Tests", () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test("GET /productsList - Should return all products successfully", async () => {
    const result = await apiClient.getAllProducts();

    expect(result.response.status()).toBe(200);

    const data = await result.response.json();

    expect(data).toBeTruthy();
    expect(data).toHaveProperty("products");
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);

    const products: Product[] = data.products;
    const firstProduct = products[0];

    expect(firstProduct.id).toBeGreaterThan(0);
    expect(typeof firstProduct.id).toBe("number");

    expect(firstProduct.name).toBeTruthy();
    expect(typeof firstProduct.name).toBe("string");

    expect(firstProduct.price).toBeTruthy();
    expect(typeof firstProduct.price).toBe("string");

    expect(firstProduct.brand).toBeTruthy();
    expect(typeof firstProduct.brand).toBe("string");

    expect(firstProduct.category.category).toBeTruthy();
    expect(firstProduct.category.usertype.usertype).toBeTruthy();
  });

  test("GET /productsList - Should have consistent product data", async () => {
    const result = await apiClient.getAllProducts();

    expect(result.response.status()).toBe(200);

    const data = await result.response.json();

    expect(data).toBeTruthy();
    expect(data).toHaveProperty("products");
    expect(Array.isArray(data.products)).toBe(true);

    const products: Product[] = data.products;
    const productsToCheck = products.slice(0, 5);

    for (const product of productsToCheck) {
      expect(product.id).toBeGreaterThan(0);
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.price.length).toBeGreaterThan(0);
      expect(product.brand.length).toBeGreaterThan(0);

      expect(product.category.category.length).toBeGreaterThan(0);
      expect(product.category.usertype.usertype.length).toBeGreaterThan(0);
    }
  });

  test("GET /productsList - Response time should be reasonable", async () => {
    const startTime = Date.now();
    const result = await apiClient.getAllProducts();
    const duration = Date.now() - startTime;

    expect(result.response.status()).toBe(200);
    expect(duration).toBeLessThan(5000);
  });
});
