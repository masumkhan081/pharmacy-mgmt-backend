import { IDType } from "./requestResponse";

export type UserRole = "ADMIN" | "MANAGER" | "SALESMAN";

export interface IUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  password?: string;
  role: UserRole;
  staffId?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateInput {
  username: string;
  email: string;
  name?: string;
  password: string;
  role: UserRole;
  staffId?: string;
}

export interface IUserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
}
