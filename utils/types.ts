export interface SignUpFormData {
  title: "Mr" | "Mrs";
  name: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address1: string;
  country: Country;
  state: string;
  city: string;
  zipcode: string;
  mobile_number: string;
}
export type Country =
  | "India"
  | "United States"
  | "Canada"
  | "Australia"
  | "Israel"
  | "New Zealand"
  | "Singapore";

export interface FullUserData extends SignUpFormData {
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  company?: string;
  address2?: string;
}

export interface PaymentInfo {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface ApiResponse<T = any> {
  response: import("@playwright/test").APIResponse;
  data: T | null;
  text: string;
}
