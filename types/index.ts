export type UserRole = "donor" | "ngo";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: string | Date;
}

export type DonationCategory =
  | "Food"
  | "Clothes"
  | "Books"
  | "Stationery"
  | "Blankets"
  | "Essentials"
  | "Other";

export type DonationStatus =
  | "Listed"
  | "Matched"
  | "Accepted"
  | "Picked Up"
  | "Delivered"
  | "Received";

export interface IDonation {
  _id?: string;
  donorId?: string;
  donorName?: string;
  itemName: string;
  category: DonationCategory;
  quantity: number;
  description: string;
  location: string;
  status: DonationStatus;
  createdAt?: string | Date;
}

export type RequirementUrgency = "Low" | "Medium" | "High" | "Critical";

export type RequirementStatus = "Active" | "Fulfilled" | "Cancelled";

export interface IRequirement {
  _id?: string;
  ngoId?: string;
  ngoName?: string;
  itemName: string;
  category: DonationCategory;
  quantityNeeded: number;
  quantityReceived: number;
  description: string;
  location: string;
  urgency: RequirementUrgency;
  status: RequirementStatus;
  createdAt?: string | Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

