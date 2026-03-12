import type { ActionType, ManagedUser, RoleFilter, StatusFilter } from "./types";

type UsersResponse = {
  users?: ManagedUser[];
  error?: string;
};

type MutationResponse = {
  error?: string;
};

export async function fetchUsers(search: string, roleFilter: RoleFilter, statusFilter: StatusFilter) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  params.set("role", roleFilter);
  params.set("status", statusFilter);

  const response = await fetch(`/api/admin/users?${params.toString()}`, {
    method: "GET",
  });

  const data = (await response.json()) as UsersResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load users");
  }

  return data.users ?? [];
}

export async function patchUserAction(userId: string, action: ActionType) {
  const response = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, action }),
  });

  const data = (await response.json()) as MutationResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update user");
  }
}

export async function updateUser(userId: string, name: string, email: string) {
  const response = await fetch("/api/admin/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, name, email }),
  });

  const data = (await response.json()) as MutationResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update user");
  }
}

export async function deleteUserRequest(userId: string) {
  const response = await fetch("/api/admin/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = (await response.json()) as MutationResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to delete user");
  }
}