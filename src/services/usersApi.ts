import { baseApi } from '@/services/baseApi';

// Server user model
export interface UserAccount {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: string;
  roles: string[];
}

export interface RoleOption {
  id: number;
  name: string;
  description: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET role options for user forms
    getRoleOptions: builder.query<RoleOption[], void>({
      query: () => 'api/roles',
      providesTags: ['Roles'],
    }),

    // GET all users
    getUsers: builder.query<UserAccount[], void>({
      query: () => 'api/users',
      providesTags: ['Users'], // optional, helps with cache invalidation
    }),

    // GET single user by ID
    getUserById: builder.query<UserAccount, number | string>({
      query: (id) => `api/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // CREATE new user
    createUser: builder.mutation<UserAccount, Omit<UserAccount, 'id'>>({
      query: (body) => ({
        url: 'api/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'], // refresh list after creation
    }),

    // UPDATE user
    updateUser: builder.mutation<UserAccount, Partial<UserAccount> & { id: number | string }>({
      query: ({ id, ...body }) => ({
        url: `api/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users'], // refresh list after update
    }),

    // DELETE user
    deleteUser: builder.mutation<{ success?: boolean }, number | string>({
      query: (id) => ({
        url: `api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'], // refresh list after deletion
    }),

    // ASSIGN roles to user
    assignRolesToUser: builder.mutation<
      unknown,
      { userId: number | string; roleIds?: number[]; roleNames?: string[] }
    >({
      query: ({ userId, roleIds = [], roleNames = [] }) => ({
        url: `api/users/${userId}/roles`,
        method: 'POST',
        body: roleIds.length > 0 ? { roleIds } : { roles: roleNames },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRoleOptionsQuery,
  useAssignRolesToUserMutation,
} = usersApi;