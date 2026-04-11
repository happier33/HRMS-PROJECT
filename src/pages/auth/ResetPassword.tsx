import React, { useEffect, useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Lock } from 'lucide-react';
import { useUI } from '@/app/store';
import { useResetPasswordMutation, useForgotPasswordMutation } from '@/services/authApi';

const ResetPassword: React.FC = () => {
  const { addToast, setCurrentPage } = useUI();

  const [email, setEmail] = useState(localStorage.getItem('reset_email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [resendOtp] = useForgotPasswordMutation();

  // ⏱ Timer logic
  useEffect(() => {
    const expiry = Number(localStorage.getItem('otp_expiry'));

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      addToast('Enter email and OTP', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (timeLeft <= 0) {
      addToast('OTP expired. Request new one.', 'error');
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword }).unwrap();

      addToast('Password reset successful', 'success');

      localStorage.removeItem('reset_email');
      localStorage.removeItem('otp_expiry');

      setCurrentPage('login');

    } catch (err: any) {
      addToast(err?.data?.message || 'Reset failed', 'error');
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();

      localStorage.setItem('otp_expiry', (Date.now() + 5 * 60 * 1000).toString());

      addToast('OTP resent', 'success');
      setTimeLeft(300);

    } catch {
      addToast('Failed to resend OTP', 'error');
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleReset} className="space-y-5">

          <Input
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Input
            label="OTP Code"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            required
          />

          {/* ⏱ Timer */}
          <div className="text-sm text-center text-gray-500">
            OTP expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" fullWidth loading={isLoading}>
            Reset Password
          </Button>

          {/* Resend */}
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0}
            className="text-sm text-blue-600 w-full"
          >
            {timeLeft > 0 ? 'Resend available after expiry' : 'Resend OTP'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;