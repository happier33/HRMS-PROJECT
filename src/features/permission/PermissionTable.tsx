// features/permission/PermissionTable.tsx
import React, { useState } from 'react';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useUI } from '@/app/store';
import {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  type Permission,
} from '@/services/permissionsApi';
import { Edit2, Trash2, Plus } from 'lucide-react';

const PermissionTable: React.FC = () => {
  const { addToast } = useUI();
  const { data: permissions = [], isLoading, isError, refetch } = useGetPermissionsQuery();

  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formState, setFormState] = useState<Partial<Permission>>({});

  const { data: selectedPermission } = useGetPermissionByIdQuery(selectedPermissionId!, {
    skip: !selectedPermissionId,
  });

  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();
  const [deletePermission, { isLoading: isDeleting }] = useDeletePermissionMutation();

  const openEdit = (perm: Permission) => {
    setSelectedPermissionId(perm.id);
    setFormState({
      id: perm.id,
      name: perm.name,
      description: perm.description,
    });
    setIsEditOpen(true);
  };

  const openDelete = (perm: Permission) => {
    setSelectedPermissionId(perm.id);
    setIsDeleteOpen(true);
  };

  const resetModals = () => {
    setSelectedPermissionId(null);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setShowCreateModal(false);
    setFormState({});
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id) return;
    try {
      await updatePermission(formState as Permission).unwrap();
      addToast('Permission updated successfully', 'success');
      resetModals();
      refetch();
    } catch {
      addToast('Failed to update permission', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPermissionId) return;
    try {
      await deletePermission(selectedPermissionId).unwrap();
      addToast('Permission deleted successfully', 'success');
      resetModals();
      refetch();
    } catch {
      addToast('Failed to delete permission', 'error');
    }
  };

  const columns: Column<Permission>[] = [
    { key: 'name', header: 'Permission', render: (row) => <span>{row.name}</span> },
    { key: 'description', header: 'Description', render: (row) => <span>{row.description}</span> },
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Permissions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage system permissions
          </p>
        </div>

        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Create Permission
        </Button>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          {isLoading && <div className="py-8 text-center text-sm text-muted-foreground">Loading permissions...</div>}
          {isError && <div className="py-8 text-center text-sm text-red-500">Failed to load permissions.</div>}
          {!isLoading && !isError && <DataTable columns={columns} data={permissions} searchPlaceholder="Search permissions..." pageSize={10} />}
        </div>
      </Card>

      {/* CREATE MODAL */}
      <Modal isOpen={showCreateModal} onClose={resetModals} title="Create Permission" size="md">
        <PermissionForm
          formState={formState}
          setFormState={setFormState}
          submitFn={createPermission}
          onClose={resetModals}
          addToast={addToast}
          refetch={refetch}
          isLoading={isCreating}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={resetModals} title="Edit Permission" size="md">
        {(selectedPermission || formState.id) && (
          <PermissionForm
            formState={formState}
            setFormState={setFormState}
            submitFn={updatePermission}
            onClose={resetModals}
            addToast={addToast}
            refetch={refetch}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={resetModals} title="Delete Permission">
        <div className="space-y-4">
          <p>Are you sure you want to delete this permission?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetModals}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── Permission Form ───
interface PermissionFormProps {
  formState: Partial<Permission>;
  setFormState: React.Dispatch<React.SetStateAction<Partial<Permission>>>;
  submitFn: any;
  onClose: () => void;
  addToast: (msg: string, type: 'success' | 'error') => void;
  refetch: () => void;
  isLoading: boolean;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ formState, setFormState, submitFn, onClose, addToast, refetch, isLoading }) => {
  const handleChange = (field: keyof Permission, value: string) => setFormState(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) { addToast('Name is required', 'error'); return; }

    try {
      await submitFn(formState as Permission).unwrap();
      addToast(`Permission ${formState.id ? 'updated' : 'created'} successfully`, 'success');
      refetch();
      onClose();
    } catch {
      addToast('Failed to save permission', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input
          className="hrms-input"
          value={formState.name ?? ''}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Description</label>
        <input
          className="hrms-input"
          value={formState.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default PermissionTable;