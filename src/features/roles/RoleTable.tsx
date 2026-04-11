import React, { useState } from 'react';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useUI } from '@/app/store';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionCatalogForRolesQuery,
  useGetPermissionsByRoleIdQuery,
  useAssignPermissionsToRoleMutation,
  useRemovePermissionFromRoleMutation,
  type Role,
} from '@/services/rolesApi';
import { Edit2, Trash2, Plus, Shield } from 'lucide-react';

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

const RolesTable: React.FC = () => {
  const { addToast } = useUI();

  // API
  const { data: roles = [], isLoading, isError } = useGetRolesQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  // STATE
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  const [formState, setFormState] = useState<Partial<Role>>({
    name: '',
    description: '',
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const { data: permissionCatalog = [] } = useGetPermissionCatalogForRolesQuery();
  const { data: rolePermissions = [], isFetching: isRolePermissionsLoading } =
    useGetPermissionsByRoleIdQuery(selectedRole?.id ?? 0, {
      skip: !selectedRole || !isPermissionsOpen,
    });
  const [assignPermissionsToRole, { isLoading: isAssigningPermissions }] =
    useAssignPermissionsToRoleMutation();
  const [removePermissionFromRole, { isLoading: isRemovingPermission }] =
    useRemovePermissionFromRoleMutation();

  // ---------------- OPEN EDIT ----------------
  const openEdit = (role: Role) => {
    setSelectedRole(role);
    setFormState({
      id: role.id,
      name: role.name,
      description: role.description,
    });
    setIsEditOpen(true);
  };

  // ---------------- OPEN DELETE ----------------
  const openDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  // ---------------- RESET ----------------
  const resetModals = () => {
    setSelectedRole(null);
    setShowCreateModal(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsPermissionsOpen(false);
    setFormState({ name: '', description: '' });
    setSelectedPermissionIds([]);
  };

  const openPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsOpen(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!selectedRole) return;

    try {
      await deleteRole(selectedRole.id).unwrap();
      addToast('Role deleted successfully', 'success');
      resetModals();
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error, 'Failed to delete role'), 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("FORM STATE:", formState);
  
    if (!formState.name) {
      addToast("Role name is required", "error");
      return;
    }
  
    try {
      // CREATE
      if (!formState.id) {
        const res = await createRole({
          name: formState.name,
          description: formState.description ?? null,
        }).unwrap();
  
        console.log("CREATE SUCCESS:", res);
        addToast("Role created successfully", "success");
      }
  
      // UPDATE
      else {
        const res = await updateRole({
          id: formState.id,
          body: {
            name: formState.name,
            description: formState.description ?? null,
          },
        }).unwrap();
  
        console.log("UPDATE SUCCESS:", res);
        addToast("Role updated successfully", "success");
      }
  
      resetModals();
    } catch (err: unknown) {
      console.log("❌ API ERROR:", err);
      addToast(getApiErrorMessage(err, "Failed to save role"), "error");
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    const currentPermissionIds = rolePermissions.map((permission) => permission.id);
    const permissionIdsToAssign = selectedPermissionIds.filter(
      (id) => !currentPermissionIds.includes(id)
    );
    const permissionIdsToRemove = currentPermissionIds.filter(
      (id) => !selectedPermissionIds.includes(id)
    );

    try {
      if (permissionIdsToAssign.length > 0) {
        await assignPermissionsToRole({
          roleId: selectedRole.id,
          permissionIds: permissionIdsToAssign,
        }).unwrap();
      }

      if (permissionIdsToRemove.length > 0) {
        await Promise.all(
          permissionIdsToRemove.map((permissionId) =>
            removePermissionFromRole({
              roleId: selectedRole.id,
              permissionId,
            }).unwrap()
          )
        );
      }

      addToast('Role permissions updated successfully', 'success');
      resetModals();
    } catch (error: unknown) {
      addToast(
        getApiErrorMessage(error, 'Failed to update role permissions'),
        'error'
      );
    }
  };

  React.useEffect(() => {
    if (isPermissionsOpen) {
      setSelectedPermissionIds(rolePermissions.map((permission) => permission.id));
    }
  }, [isPermissionsOpen, rolePermissions]);
  // ---------------- TABLE COLUMNS ----------------
  const columns: Column<Role>[] = [
    {
      key: 'name',
      header: 'Role Name',
      render: (row) => <span>{row.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span>{row.description || 'No description'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
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
              openPermissions(row);
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

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Roles</h2>
          <p className="text-sm text-muted-foreground">
            Manage system roles
          </p>
        </div>

        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setFormState({ name: '', description: '' });
            setShowCreateModal(true);
          }}
        >
          Create Role
        </Button>
      </div>

      {/* TABLE */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          {isLoading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading roles...
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-sm text-red-500">
              Failed to load roles
            </div>
          )}

          {!isLoading && !isError && (
            <DataTable
              columns={columns}
              data={roles}
              searchPlaceholder="Search roles..."
              pageSize={10}
            />
          )}
        </div>
      </Card>

      {/* CREATE MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetModals}
        title="Create Role"
      >
        <RoleForm
          formState={formState}
          setFormState={setFormState}
          onSubmit={handleSubmit}
          isLoading={isCreating}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={resetModals} title="Edit Role">
        <RoleForm
          formState={formState}
          setFormState={setFormState}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={resetModals} title="Delete Role">
        <div className="space-y-4">
          <p>Are you sure you want to delete this role?</p>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetModals}>
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MANAGE PERMISSIONS MODAL */}
      <Modal
        isOpen={isPermissionsOpen}
        onClose={resetModals}
        title={`Manage Permissions${selectedRole ? ` - ${selectedRole.name}` : ''}`}
        size="md"
      >
        <div className="space-y-4">
          {isRolePermissionsLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading role permissions...
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {permissionCatalog.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                    />
                    <div>
                      <p className="text-sm font-medium">{permission.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {permission.description || 'No description'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button variant="outline" onClick={resetModals}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePermissions}
                  disabled={isAssigningPermissions || isRemovingPermission}
                >
                  {isAssigningPermissions || isRemovingPermission
                    ? 'Saving...'
                    : 'Save Permissions'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ---------------- ROLE FORM (INSIDE SAME FILE) ---------------- */}
      {(function RoleForm() {
        return (
          <></>
        );
      })()}

    </div>
  );
};

export default RolesTable;

/* ================= ROLE FORM (still inside same file) ================= */

interface RoleFormProps {
  formState: Partial<Role>;
  setFormState: React.Dispatch<React.SetStateAction<Partial<Role>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  formState,
  setFormState,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Role Name</label>
        <input
          className="hrms-input"
          value={formState.name ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <input
          className="hrms-input"
          value={formState.description ?? ''}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* BUTTON */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};