import type { Id } from "../../convex/_generated/dataModel";

export type UserRole = "admin" | "public";

export interface UserRecord {
  id: Id<"users">;
  tokenIdentifier: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
