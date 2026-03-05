"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  profileImage: string;
  role: string;
  baseRole: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

type ActionType = "promote" | "demote" | "suspend" | "reactivate";

export default function AdminUserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("search", search.trim());
      }
      params.set("role", roleFilter);
      params.set("status", statusFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: "GET",
      });

      const data = (await response.json()) as { users?: ManagedUser[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load users");
      }

      setUsers(data.users ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, search, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setSelectedUserIds((previous) =>
      previous.filter((id) => users.some((user) => user.id === id && user.baseRole === "USER")),
    );
  }, [users]);

  async function runAction(userId: string, action: ActionType) {
    setActiveUserId(userId);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update user");
      }

      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update user");
    } finally {
      setActiveUserId(null);
    }
  }

  function startEdit(user: ManagedUser) {
    setEditingUserId(user.id);
    setEditName(user.name ?? "");
    setEditEmail(user.email);
  }

  function cancelEdit() {
    setEditingUserId(null);
    setEditName("");
    setEditEmail("");
  }

  async function saveEdit(userId: string) {
    setActiveUserId(userId);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name: editName, email: editEmail }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update user");
      }

      cancelEdit();
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update user");
    } finally {
      setActiveUserId(null);
    }
  }

  async function requestDeleteUser(userId: string) {
    const response = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      throw new Error(data.error ?? "Failed to delete user");
    }
  }

  async function deleteUser(userId: string) {
    const isConfirmed = window.confirm("Delete this user account permanently?");

    if (!isConfirmed) {
      return;
    }

    setActiveUserId(userId);
    setError(null);

    try {
      await requestDeleteUser(userId);
      setSelectedUserIds((previous) => previous.filter((id) => id !== userId));

      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user");
    } finally {
      setActiveUserId(null);
    }
  }

  async function deleteSelectedUsers() {
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
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete selected users");
    } finally {
      setIsBulkDeleting(false);
    }
  }

  function toggleSelectUser(userId: string, checked: boolean) {
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

  const selectableUserIds = useMemo(
    () => users.filter((user) => user.baseRole === "USER").map((user) => user.id),
    [users],
  );

  const allSelected =
    selectableUserIds.length > 0 &&
    selectableUserIds.every((userId) => selectedUserIds.includes(userId));

  const someSelected =
    selectableUserIds.some((userId) => selectedUserIds.includes(userId)) && !allSelected;

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedUserIds(selectableUserIds);
      return;
    }

    setSelectedUserIds([]);
  }

  const hasUsers = useMemo(() => users.length > 0, [users]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">User management</h2>

      <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Search</span>
          <input
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
            type="text"
            value={search}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Role</span>
          <select
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setRoleFilter(event.target.value as "ALL" | "USER")}
            value={roleFilter}
          >
            <option value="ALL">All roles</option>
            <option value="USER">User</option>
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Status</span>
          <select
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | "ACTIVE" | "SUSPENDED")}
            value={statusFilter}
          >
            <option value="ALL">All status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </label>

        <div className="sm:col-span-3">
          <button
            className="rounded border border-black px-4 py-2 text-sm font-medium"
            onClick={loadUsers}
            type="button"
          >
            Apply filters
          </button>
        </div>
      </div>

      {error ? <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm">{error}</p> : null}

      {isLoading ? <p className="text-sm text-black/70">Loading users...</p> : null}

      {!isLoading && !hasUsers ? <p className="text-sm text-black/70">No users found.</p> : null}

      {!isLoading && hasUsers ? (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-black/[0.015] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-black/70">
              {selectedUserIds.length ? `${selectedUserIds.length} selected` : "Select users to bulk delete"}
            </p>
            {selectedUserIds.length ? (
              <button
                className="rounded border border-black px-3 py-1.5 text-sm font-medium"
                disabled={isBulkDeleting}
                onClick={deleteSelectedUsers}
                type="button"
              >
                {isBulkDeleting ? "Deleting..." : `Delete selected (${selectedUserIds.length})`}
              </button>
            ) : null}
          </div>

          <table className="min-w-[1200px] w-full border-separate text-left text-sm [border-spacing:0_10px]">
            <thead className="text-xs uppercase tracking-wide text-black/60">
              <tr>
                <th className="px-3 py-2 font-semibold">
                  <input
                    aria-label="Select all users"
                    checked={allSelected}
                    className="h-4 w-4 rounded border border-black/30"
                    onChange={(event) => toggleSelectAll(event.target.checked)}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate = someSelected;
                      }
                    }}
                    type="checkbox"
                  />
                </th>
                <th className="px-3 py-2 font-semibold">User</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Role</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isBusy = activeUserId === user.id;
                const isEditing = editingUserId === user.id;
                const canEditOrDelete = user.baseRole === "USER";
                const isSelected = selectedUserIds.includes(user.id);
                const displayName = user.name ?? "No name";
                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "U";

                return (
                  <tr
                    className={`game-card-shadow transition hover:-translate-y-0.5 ${
                      isSelected ? "bg-black/[0.03]" : "bg-white"
                    }`}
                    key={user.id}
                  >
                    <td className="rounded-l-xl border-y border-l border-black/10 bg-inherit px-3 py-3 align-middle">
                      <input
                        aria-label={`Select ${displayName}`}
                        checked={selectedUserIds.includes(user.id)}
                        className="h-4 w-4 rounded border border-black/30"
                        disabled={!canEditOrDelete || isBulkDeleting}
                        onChange={(event) => toggleSelectUser(user.id, event.target.checked)}
                        type="checkbox"
                      />
                    </td>
                    <td className="border-y border-black/10 bg-inherit px-3 py-3 align-middle">
                      {isEditing ? (
                        <input
                          className="w-full rounded border border-black/15 px-2 py-1"
                          onChange={(event) => setEditName(event.target.value)}
                          value={editName}
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/5 text-xs font-semibold">
                            {user.profileImage ? (
                              <Image alt={displayName} className="object-cover" fill sizes="32px" src={user.profileImage} />
                            ) : (
                              initials
                            )}
                          </div>
                          <span className="font-medium">{displayName}</span>
                        </div>
                      )}
                    </td>
                    <td className="border-y border-black/10 bg-inherit px-3 py-3 align-middle text-black/70">
                      {isEditing ? (
                        <input
                          className="w-full rounded border border-black/15 px-2 py-1"
                          onChange={(event) => setEditEmail(event.target.value)}
                          type="email"
                          value={editEmail}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="border-y border-black/10 bg-inherit px-3 py-3 align-middle text-black/70">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="border-y border-black/10 bg-inherit px-3 py-3 align-middle">{user.baseRole}</td>
                    <td className="border-y border-black/10 bg-inherit px-3 py-3 align-middle">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-black/20 bg-black/5 text-black/70"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Approved" : "Suspended"}
                      </span>
                    </td>
                    <td className="rounded-r-xl border-y border-r border-black/10 bg-inherit px-3 py-3 align-middle">
                      <div className="flex flex-wrap justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="rounded border border-black px-2 py-1"
                              disabled={isBusy}
                              onClick={() => saveEdit(user.id)}
                              type="button"
                            >
                              Save
                            </button>
                            <button
                              className="rounded border border-black/20 px-2 py-1"
                              disabled={isBusy}
                              onClick={cancelEdit}
                              type="button"
                            >
                              Cancel
                            </button>
                          </>
                        ) : canEditOrDelete ? (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => startEdit(user)}
                            type="button"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="rounded border border-black/10 px-2 py-1 text-black/50">
                            Protected
                          </span>
                        )}

                        {user.status === "ACTIVE" && user.baseRole === "USER" ? (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => runAction(user.id, "promote")}
                            type="button"
                          >
                            Promote
                          </button>
                        ) : null}

                        {user.status === "ACTIVE" && user.baseRole === "ADMIN" ? (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => runAction(user.id, "demote")}
                            type="button"
                          >
                            Demote
                          </button>
                        ) : null}

                        {user.status === "ACTIVE" ? (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => runAction(user.id, "suspend")}
                            type="button"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => runAction(user.id, "reactivate")}
                            type="button"
                          >
                            Reactivate
                          </button>
                        )}

                        {canEditOrDelete ? (
                          <button
                            className="rounded border border-black/20 px-2 py-1"
                            disabled={isBusy}
                            onClick={() => deleteUser(user.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
