"use client";

import AdminUserManagementView from "./AdminUserManagementView";
import { useAdminUserManagement } from "./useAdminUserManagement";

export {
  cancelEdit,
  deleteSelectedUsers,
  deleteUser,
  loadUsers,
  requestDeleteUser,
  runAction,
  saveEdit,
  startEdit,
  toggleSelectUser,
} from "./actions";
export type { ActionType, ManagedUser, RoleFilter, StatusFilter } from "./types";
export { useAdminUserManagement } from "./useAdminUserManagement";

export default function AdminUserManagement() {
  const adminUserManagement = useAdminUserManagement();

  return <AdminUserManagementView {...adminUserManagement} />;
}