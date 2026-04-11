import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useUI } from '@/app/store';
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRoleOptionsQuery,
  useAssignRolesToUserMutation,
  type UserAccount,
} from '@/services/usersApi';
import { Edit2, Trash2, UserPlus, Shield } from 'lucide-react';

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  const errorWithData = error as { data?: unknown; error?: string };
  const data = errorWithData.data;

  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const message =
      (typeof record.message === 'string' && record.message) ||
      (typeof record.error === 'string' && record.error) ||
      (typeof record.detail === 'string' && record.detail) ||
      (typeof record.title === 'string' && record.title);
    if (message) return message;
  }

  if (typeof errorWithData.error === 'string' && errorWithData.error) {
    return errorWithData.error;
  }

  return fallback;
};

const UserTable: React.FC = () => {
  const { addToast } = useUI();
  const { data: roles = [] } = useGetRoleOptionsQuery(); // Roles from API
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formState, setFormState] = useState<Partial<UserAccount>>({});
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const { data: selectedUser } = useGetUserByIdQuery(selectedUserId!, {
    skip: !selectedUserId,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [assignRolesToUser, { isLoading: isAssigningRole }] = useAssignRolesToUserMutation();

  const openEdit = (user: UserAccount) => {
    setSelectedUserId(user.id);
    setFormState({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      roles: user.roles,
    });
    setIsEditOpen(true);
  };

  const openDelete = (user: UserAccount) => {
    setSelectedUserId(user.id);
    setIsDeleteOpen(true);
  };

  const resetModals = () => {
    setSelectedUserId(null);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsAssignRoleOpen(false);
    setShowCreateModal(false);
    setFormState({});
    setSelectedRoleId('');
  };

  const openAssignRole = (user: UserAccount) => {
    setSelectedUserId(user.id);
    const matchedRole = roles.find((role) => role.name === user.roles?.[0]);
    setSelectedRoleId(matchedRole ? String(matchedRole.id) : '');
    setIsAssignRoleOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id) return;

    try {
      await updateUser(formState as UserAccount).unwrap();
      addToast('User updated successfully', 'success');
      resetModals();
      refetch();
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error, 'Failed to update user'), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser(selectedUserId).unwrap();
      addToast('User deleted successfully', 'success');
      resetModals();
      refetch();
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error, 'Failed to delete user'), 'error');
    }
  };

  const handleAssignRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedRoleId) return;

    try {
      const roleId = Number(selectedRoleId);
      const selectedRole = roles.find((role) => role.id === roleId);
      await assignRolesToUser({
        userId: selectedUserId,
        roleIds: Number.isNaN(roleId) ? [] : [roleId],
        roleNames: selectedRole ? [selectedRole.name] : [],
      }).unwrap();
      addToast('User role assigned successfully', 'success');
      resetModals();
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error, 'Failed to assign user role'), 'error');
    }
  };

  const columns: Column<UserAccount>[] = [
    {
      key: 'username',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
            {row.username
              .split(/[.\s]/)
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.username}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const label =
          row.status.toUpperCase() === 'ACTIVE'
            ? 'Active'
            : row.status.toUpperCase() === 'INACTIVE'
            ? 'Inactive'
            : row.status;
        return (
          <Badge variant={getStatusBadgeVariant(label)} dot>
            {label}
          </Badge>
        );
      },
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (row) => (
        <span className="text-xs font-medium text-muted-foreground">
          {row.roles.join(', ')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDelete(row);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAssignRole(row);
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">System Users</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage application users, roles and access.
          </p>
        </div>

        <Button
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Create User
        </Button>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          {isLoading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading users...
            </div>
          )}
          {isError && (
            <div className="py-8 text-center text-sm text-red-500">
              Failed to load users.
            </div>
          )}
          {!isLoading && !isError && (
            <DataTable
              columns={columns}
              data={users}
              searchPlaceholder="Search users..."
              pageSize={10}
            />
          )}
        </div>
      </Card>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetModals}
        title="Create User"
        size="md"
      >
        <CreateUserForm
          roles={roles}
          createUser={createUser}
          onClose={resetModals}
          addToast={addToast}
          refetch={refetch}
          isCreating={isCreating}
        />
      </Modal>
      
{/* EDIT USER MODAL */}
<Modal isOpen={isEditOpen} onClose={resetModals} title="Edit User" size="md">
  {(selectedUser || formState.id) && (
    <form
      onSubmit={handleUpdateSubmit}
      className="space-y-4"
    >
      {/* Username */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Username</label>
        <input
          className="hrms-input"
          value={formState.username ?? selectedUser?.username ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          className="hrms-input"
          type="email"
          value={formState.email ?? selectedUser?.email ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Phone</label>
        <input
          className="hrms-input"
          value={formState.phone ?? selectedUser?.phone ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Role</label>
        <select
          className="hrms-input"
          value={formState.roles?.[0] ?? selectedUser?.roles?.[0] ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, roles: [e.target.value] }))
          }
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <Button variant="outline" onClick={resetModals}>
          Cancel
        </Button>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update User'}
        </Button>
      </div>
    </form>
  )}
</Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={resetModals} title="Delete User">
        <div className="space-y-4">
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetModals}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ASSIGN ROLE MODAL */}
      <Modal isOpen={isAssignRoleOpen} onClose={resetModals} title="Assign Role" size="md">
        <form onSubmit={handleAssignRoleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Role</label>
            <select
              className="hrms-input"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={String(role.id)}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={resetModals}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAssigningRole}>
              {isAssigningRole ? 'Assigning...' : 'Assign Role'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ─── Create User Form ───
const CreateUserForm = ({
  roles,
  createUser,
  onClose,
  addToast,
  refetch,
  isCreating,
}: any) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    roles: [''], // store role names
  });

  const update = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roles[0]) {
      addToast('Please select a role', 'error');
      return;
    }

    try {
      await createUser(formData).unwrap();
      addToast('User created successfully', 'success');
      refetch();
      onClose();
    } catch {
      addToast('Failed to create user', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="hrms-input"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => update('username', e.target.value)}
        required
      />
      <input
        className="hrms-input"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => update('email', e.target.value)}
        required
      />
      <input
        className="hrms-input"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => update('phone', e.target.value)}
      />
      <select
        className="hrms-input"
        value={formData.roles[0]}
        onChange={(e) => update('roles', [e.target.value])}
        required
      >
        <option value="" disabled>
          Select Role
        </option>
        {roles.map((role: { id: number; name: string; description: string }) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserTable;