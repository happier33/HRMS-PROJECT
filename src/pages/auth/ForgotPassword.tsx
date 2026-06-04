import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Mail, Building2, ArrowLeft, Send } from 'lucide-react';
import { useAuth, useUI } from '@/app/store';
import { useForgotPasswordMutation } from '@/services/authApi';

const ForgotPassword: React.FC = () => {
  const { dispatch } = useAuth();
  const { addToast } = useUI();

  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      addToast('Enter your email', 'error');
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();

      addToast('OTP sent (valid for 5 minutes)', 'success');

      // Save email for next step
      localStorage.setItem('reset_email', email);
      localStorage.setItem('otp_expiry', (Date.now() + 5 * 60 * 1000).toString());

      dispatch({ type: 'UI_SET_CURRENT_PAGE', payload: 'reset-password' });

    } catch (err: any) {
      addToast(err?.data?.message || 'Failed to send OTP', 'error');
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
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Forgot your password?</h2>
            <p className="text-sm text-slate-500">
              Enter your work email and we'll send you a one-time code to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Button type="submit" fullWidth loading={isLoading} iconRight={<Send className="w-4 h-4" />}>
              Send OTP
            </Button>
          </form>

          {/* Back to login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => dispatch({ type: 'UI_SET_CURRENT_PAGE', payload: 'login' })}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500">
            © 2026 St John's University - Tanzania. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
