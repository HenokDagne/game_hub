import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelEdit,
  deleteSelectedUsers,
  deleteUser,
  loadUsers,
  runAction,
  saveEdit,
  startEdit,
  toggleSelectUser,
} from "./actions";
import type { ActionType, ManagedUser, RoleFilter, StatusFilter } from "./types";

export function useAdminUserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const reloadUsers = useCallback(async () => {
    await loadUsers({
      search,
      roleFilter,
      statusFilter,
      setIsLoading,
      setError,
      setUsers,
    });
  }, [roleFilter, search, statusFilter]);

  useEffect(() => {
    void reloadUsers();
  }, [reloadUsers]);

  useEffect(() => {
    setSelectedUserIds((previous) =>
      previous.filter((id) => users.some((user) => user.id === id && user.baseRole === "USER")),
    );
  }, [users]);

  const selectableUserIds = useMemo(
    () => users.filter((user) => user.baseRole === "USER").map((user) => user.id),
    [users],
  );

  const allSelected =
    selectableUserIds.length > 0 &&
    selectableUserIds.every((userId) => selectedUserIds.includes(userId));

  const someSelected =
    selectableUserIds.some((userId) => selectedUserIds.includes(userId)) && !allSelected;

  const hasUsers = useMemo(() => users.length > 0, [users]);

  function onStartEdit(user: ManagedUser) {
    startEdit({
      user,
      setEditingUserId,
      setEditName,
      setEditEmail,
    });
  }

  function onCancelEdit() {
    cancelEdit({
      setEditingUserId,
      setEditName,
      setEditEmail,
    });
  }

  async function onRunAction(userId: string, action: ActionType) {
    await runAction({
      userId,
      action,
      setActiveUserId,
      setError,
      reloadUsers,
    });
  }

  async function onSaveEdit(userId: string) {
    await saveEdit({
      userId,
      editName,
      editEmail,
      setActiveUserId,
      setError,
      clearEdit: onCancelEdit,
      reloadUsers,
    });
  }

  async function onDeleteUser(userId: string) {
    await deleteUser({
      userId,
      setActiveUserId,
      setError,
      setSelectedUserIds,
      reloadUsers,
    });
  }

  async function onDeleteSelectedUsers() {
    await deleteSelectedUsers({
      selectedUserIds,
      setIsBulkDeleting,
      setError,
      setSelectedUserIds,
      reloadUsers,
    });
  }

  function onToggleSelectUser(userId: string, checked: boolean) {
    toggleSelectUser({
      userId,
      checked,
      setSelectedUserIds,
    });
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedUserIds(selectableUserIds);
      return;
    }

    setSelectedUserIds([]);
  }

  return {
    users,
    search,
    roleFilter,
    statusFilter,
    isLoading,
    error,
    activeUserId,
    isBulkDeleting,
    selectedUserIds,
    editingUserId,
    editName,
    editEmail,
    allSelected,
    someSelected,
    hasUsers,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setEditName,
    setEditEmail,
    loadUsers: reloadUsers,
    startEdit: onStartEdit,
    cancelEdit: onCancelEdit,
    runAction: onRunAction,
    saveEdit: onSaveEdit,
    deleteUser: onDeleteUser,
    deleteSelectedUsers: onDeleteSelectedUsers,
    toggleSelectUser: onToggleSelectUser,
    toggleSelectAll,
  };
}