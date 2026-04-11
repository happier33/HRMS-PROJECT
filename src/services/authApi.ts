import { baseApi } from './baseApi';

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
      // Login
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (body) => ({
          url: 'api//auth/login',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Auth'],
      }),
  
      // Forgot password
      forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
        query: (body) => ({
          url: '/api/auth/forgot-password',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Auth'],
      }),


      ///logout endpoint

      logout: builder.mutation<void, void>({
        query: () => ({
          url: '/api/auth/logout',
          method: 'POST',
        }),
        invalidatesTags: ['Auth'],
      }),
      
  
      // Reset password
      resetPassword: builder.mutation<void, ResetPasswordRequest>({
        query: ({ email, otp, newPassword }) => ({
          url: '/api/auth/reset-password',
          method: 'POST',
          body: {
            email,
            otp,
            newPassword,
          },
        }),
        invalidatesTags: ['Auth'],
      }),
  
    }),
  
});

export const { useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApi;