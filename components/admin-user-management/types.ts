import type { Dispatch, SetStateAction } from "react";

export type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  profileImage: string;
  role: string;
  baseRole: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

export type ActionType = "promote" | "demote" | "suspend" | "reactivate";

export type RoleFilter = "ALL" | "USER";

export type StatusFilter = "ALL" | "ACTIVE" | "SUSPENDED";

export type StateSetter<T> = Dispatch<SetStateAction<T>>;