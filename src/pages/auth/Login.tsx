import React, { useState } from 'react';
import { useAuth, useUI } from '@/app/store';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Lock, Mail, ArrowRight, Building2 } from 'lucide-react';
import { useLoginMutation } from '@/services/authApi';

const Login: React.FC = () => {
  const { auth, dispatch } = useAuth();
  const { addToast } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // RTK Query login mutation
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: 'Please enter your email and password.' });
      return;
    }

    dispatch({ type: 'AUTH_LOGIN_START' });

    try {
      // RTK Query call
      const data = await login({ email, password }).unwrap();

      // backend response: { token, username, email, roles }
      const token: string = data.token;
      const username: string = data.username;
      const responseEmail: string = data.email;
      const roles: string[] = data.roles || [];

      if (!token) {
        dispatch({
          type: 'AUTH_LOGIN_FAILURE',
          payload: 'Login succeeded but no token was returned by the server.',
        });
        return;
      }

      const primaryRole = roles[0]?.toUpperCase() || 'EMPLOYEE';

      const user = {
        id: responseEmail || email,
        name: username || responseEmail || email,
        email: responseEmail || email,
        role:
          primaryRole === 'ADMIN'
            ? 'ADMIN'
            : primaryRole === 'HR'
              ? 'HR'
              : primaryRole === 'DEMOADMIN'
                ? 'DEMOADMIN'
                : 'EMPLOYEE',
      } as const;

      // Persist token and user
      localStorage.setItem('hrms_token', token);
      localStorage.setItem('hrms_user', JSON.stringify(user));

      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: user });
      dispatch({ type: 'UI_SET_CURRENT_PAGE', payload: 'dashboard' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({
        type: 'AUTH_LOGIN_FAILURE',
        payload: errorMessage,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-slate-100 px-4 py-16">

      {/* Soft glow background */}
      <div className="absolute w-[500px] h-[500px] bg-blue-200/30 blur-3xl rounded-full -z-10"></div>

      <div className="w-full max-w-md">
        <div className="bg-slate-50 border border-slate-200 shadow-xl shadow-blue-200/40 rounded-2xl p-8 sm:p-10 space-y-8">

          {/* Logo + System */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-md">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.25em]">
                HRMS PRO
              </p>
              <p className="text-sm text-slate-600">
                Human Resource Management System
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">
              Sign in to continue to your HR dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Work email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {auth.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {auth.error}
              </div>
            )}

            <div className="flex justify-end text-sm">
              <button
                type="button"
                onClick={() => dispatch({ type: 'UI_SET_CURRENT_PAGE', payload: 'forgot-password' })}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth loading={isLoading} iconRight={<ArrowRight className="w-4 h-4" />}>
              Sign in
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            © 2026 St John's University - Tanzania. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;