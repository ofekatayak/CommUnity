export interface User {
  id: string;
  fullName: string;
  role: string;
  email: string;
  password?: string;
  status: "pending" | "approved" | "blocked";
  isAdmin: boolean;
  createdAt?: string;
}
export {};
