import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Mail } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" fullWidth loading={isLoading}>
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;