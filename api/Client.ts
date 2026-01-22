import { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiResponse, FullUserData, Product } from "../utils/types";

export class ApiClient {
  private baseURL = "https://automationexercise.com/api";

  constructor(private request: APIRequestContext) {}

  private convertToFormData<T extends Record<string, any>>(
    data: T
  ): Record<string, string> {
    const formData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      formData[key] = String(value);
    }
    return formData;
  }

  private async handleResponse<T = any>(
    response: APIResponse
  ): Promise<ApiResponse<T>> {
    let data = null;
    let text = "";

    try {
      text = await response.text();
      if (response.headers()["content-type"]?.includes("application/json")) {
        data = JSON.parse(text);
      }
    } catch (error) {
      //console.error(error);
    }

    return { response, data, text };
  }

  async getAllProducts(): Promise<ApiResponse<{ products: Product[] }>> {
    const response = await this.request.get(`${this.baseURL}/productsList`);
    return this.handleResponse(response);
  }

  async createAccount(userData: FullUserData): Promise<ApiResponse> {
    const response = await this.request.post(`${this.baseURL}/createAccount`, {
      form: this.convertToFormData(userData),
    });
    return this.handleResponse(response);
  }

  async updateAccount(userData: FullUserData): Promise<ApiResponse> {
    const response = await this.request.put(`${this.baseURL}/updateAccount`, {
      form: this.convertToFormData(userData),
    });
    return this.handleResponse(response);
  }

  async deleteAccount(email: string, password: string): Promise<ApiResponse> {
    const response = await this.request.delete(
      `${this.baseURL}/deleteAccount`,
      {
        form: {
          email,
          password,
        },
      }
    );
    return this.handleResponse(response);
  }
}
