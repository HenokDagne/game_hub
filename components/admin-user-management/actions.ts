import { deleteUserRequest, fetchUsers, patchUserAction, updateUser } from "./api";
import type { ActionType, ManagedUser, RoleFilter, StateSetter, StatusFilter } from "./types";

type LoadUsersArgs = {
  search: string;
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
  setIsLoading: StateSetter<boolean>;
  setError: StateSetter<string | null>;
  setUsers: StateSetter<ManagedUser[]>;
};

type RunActionArgs = {
  userId: string;
  action: ActionType;
  setActiveUserId: StateSetter<string | null>;
  setError: StateSetter<string | null>;
  reloadUsers: () => Promise<void>;
};

type StartEditArgs = {
  user: ManagedUser;
  setEditingUserId: StateSetter<string | null>;
  setEditName: StateSetter<string>;
  setEditEmail: StateSetter<string>;
};

type CancelEditArgs = {
  setEditingUserId: StateSetter<string | null>;
  setEditName: StateSetter<string>;
  setEditEmail: StateSetter<string>;
};

type SaveEditArgs = {
  userId: string;
  editName: string;
  editEmail: string;
  setActiveUserId: StateSetter<string | null>;
  setError: StateSetter<string | null>;
  clearEdit: () => void;
  reloadUsers: () => Promise<void>;
};

type DeleteUserArgs = {
  userId: string;
  setActiveUserId: StateSetter<string | null>;
  setError: StateSetter<string | null>;
  setSelectedUserIds: StateSetter<string[]>;
  reloadUsers: () => Promise<void>;
};

type DeleteSelectedUsersArgs = {
  selectedUserIds: string[];
  setIsBulkDeleting: StateSetter<boolean>;
  setError: StateSetter<string | null>;
  setSelectedUserIds: StateSetter<string[]>;
  reloadUsers: () => Promise<void>;
};

type ToggleSelectUserArgs = {
  userId: string;
  checked: boolean;
  setSelectedUserIds: StateSetter<string[]>;
};

export async function loadUsers({ search, roleFilter, statusFilter, setIsLoading, setError, setUsers }: LoadUsersArgs) {
  setIsLoading(true);
  setError(null);

  try {
    const users = await fetchUsers(search, roleFilter, statusFilter);
    setUsers(users);
  } catch (loadError) {
    setError(loadError instanceof Error ? loadError.message : "Failed to load users");
  } finally {
    setIsLoading(false);
  }
}

export async function runAction({ userId, action, setActiveUserId, setError, reloadUsers }: RunActionArgs) {
  setActiveUserId(userId);
  setError(null);

  try {
    await patchUserAction(userId, action);
    await reloadUsers();
  } catch (updateError) {
    setError(updateError instanceof Error ? updateError.message : "Failed to update user");
  } finally {
    setActiveUserId(null);
  }
}

export function startEdit({ user, setEditingUserId, setEditName, setEditEmail }: StartEditArgs) {
  setEditingUserId(user.id);
  setEditName(user.name ?? "");
  setEditEmail(user.email);
}

export function cancelEdit({ setEditingUserId, setEditName, setEditEmail }: CancelEditArgs) {
  setEditingUserId(null);
  setEditName("");
  setEditEmail("");
}

export async function saveEdit({ userId, editName, editEmail, setActiveUserId, setError, clearEdit, reloadUsers }: SaveEditArgs) {
  setActiveUserId(userId);
  setError(null);

  try {
    await updateUser(userId, editName, editEmail);
    clearEdit();
    await reloadUsers();
  } catch (updateError) {
    setError(updateError instanceof Error ? updateError.message : "Failed to update user");
  } finally {
    setActiveUserId(null);
  }
}

export async function requestDeleteUser(userId: string) {
  await deleteUserRequest(userId);
}

export async function deleteUser({ userId, setActiveUserId, setError, setSelectedUserIds, reloadUsers }: DeleteUserArgs) {
  const isConfirmed = window.confirm("Delete this user account permanently?");

  if (!isConfirmed) {
    return;
  }

  setActiveUserId(userId);
  setError(null);

  try {
    await requestDeleteUser(userId);
    setSelectedUserIds((previous) => previous.filter((id) => id !== userId));
    await reloadUsers();
  } catch (deleteError) {
    setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user");
  } finally {
    setActiveUserId(null);
  }
}

export async function deleteSelectedUsers({ selectedUserIds, setIsBulkDeleting, setError, setSelectedUserIds, reloadUsers }: DeleteSelectedUsersArgs) {
  if (!selectedUserIds.length) {
    return;
  }

  const isConfirmed = window.confirm(`Delete ${selectedUserIds.length} selected user(s)?`);

  if (!isConfirmed) {
    return;
  }

  setIsBulkDeleting(true);
  setError(null);

  try {
    const results = await Promise.allSettled(
      selectedUserIds.map(async (userId) => {
        await requestDeleteUser(userId);
      }),
    );

    const failed = results.filter((result) => result.status === "rejected").length;

    if (failed > 0) {
      setError(`${failed} user(s) could not be deleted`);
    }

    setSelectedUserIds([]);
    await reloadUsers();
  } catch (deleteError) {
    setError(deleteError instanceof Error ? deleteError.message : "Failed to delete selected users");
  } finally {
    setIsBulkDeleting(false);
  }
}

export function toggleSelectUser({ userId, checked, setSelectedUserIds }: ToggleSelectUserArgs) {
  setSelectedUserIds((previous) => {
    if (checked) {
      if (previous.includes(userId)) {
        return previous;
      }

      return [...previous, userId];
    }

    return previous.filter((id) => id !== userId);
  });
}