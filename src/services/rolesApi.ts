import { baseApi } from './baseApi';

export interface Role {
  id: number;
  name: string;
  description: string;
  // permissions: number[];
}

export interface RolePermission {
  id: number;
  name: string;
  description: string;
}

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET ALL
    getRoles: builder.query<Role[], void>({
      query: () => '/api/roles',
      providesTags: ['Roles'],
    }),

    // ✅ GET BY ID
    getRoleById: builder.query<Role, number>({
      query: (id) => `/api/roles/${id}`,
    }),

    // ✅ GET ALL PERMISSIONS (for role-permission management)
    getPermissionCatalogForRoles: builder.query<RolePermission[], void>({
      query: () => '/api/permissions',
      providesTags: ['Permissions'],
    }),

    // ✅ GET PERMISSIONS ASSIGNED TO A ROLE
    getPermissionsByRoleId: builder.query<RolePermission[], number>({
      query: (roleId) => `/api/roles/${roleId}/permissions`,
      providesTags: (result, error, roleId) => [{ type: 'Roles', id: roleId }],
    }),

    // ✅ CREATE
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (body) => ({
        url: '/api/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),

    // ✅ UPDATE
    updateRole: builder.mutation<Role, { id: number; body: Partial<Role> }>({
      query: ({ id, body }) => ({
        url: `/api/roles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),

    // ✅ DELETE
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // ✅ ASSIGN PERMISSIONS TO ROLE
    assignPermissionsToRole: builder.mutation<
      unknown,
      { roleId: number; permissionIds: number[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/api/roles/${roleId}/permissions`,
        method: 'POST',
        body: { permissionIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        'Roles',
        { type: 'Roles', id: roleId },
      ],
    }),

    // ✅ REMOVE PERMISSION FROM ROLE
    removePermissionFromRole: builder.mutation<
      unknown,
      { roleId: number; permissionId: number }
    >({
      query: ({ roleId, permissionId }) => ({
        url: `/api/roles/${roleId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [
        'Roles',
        { type: 'Roles', id: roleId },
      ],
    }),

  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useGetPermissionCatalogForRolesQuery,
  useGetPermissionsByRoleIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsToRoleMutation,
  useRemovePermissionFromRoleMutation,
} = rolesApi;