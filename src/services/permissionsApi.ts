import { baseApi } from '@/services/baseApi';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET all permissions
    getPermissions: builder.query<Permission[], void>({
      query: () => '/api/permissions',
      providesTags: ['Permissions'],
    }),

    // GET single permission
    getPermissionById: builder.query<Permission, number | string>({
      query: (id) => `/api/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permissions', id }],
    }),

    // CREATE permission
    createPermission: builder.mutation<Permission, Omit<Permission, 'id'>>({
      query: (body) => ({
        url: '/api/permissions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Permissions'],
    }),

    // UPDATE permission
    updatePermission: builder.mutation<
      Permission,
      Partial<Permission> & { id: number | string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/permissions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Permissions'],
    }),

    // DELETE permission
    deletePermission: builder.mutation<
      { success?: boolean },
      number | string
    >({
      query: (id) => ({
        url: `/api/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;