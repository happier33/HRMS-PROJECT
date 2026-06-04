import React, { useEffect, useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Lock, Building2, ArrowLeft, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
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
  const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

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
      addToast('OTP expired. Request a new one.', 'error');
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

  const timerColor = timeLeft > 60 ? 'text-slate-700' : 'text-red-600';

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
            <h2 className="text-2xl font-bold text-slate-900">Reset your password</h2>
            <p className="text-sm text-slate-500">
              Enter the OTP sent to your email along with your new password.
            </p>
          </div>

          {/* OTP Timer */}
          <div className={`flex items-center justify-center gap-2 text-sm font-medium ${timerColor}`}>
            <Clock className="w-4 h-4" />
            <span>
              {timeLeft > 0
                ? <>OTP expires in <span className="font-bold">{formatTime(timeLeft)}</span></>
                : <span className="text-red-600 font-semibold">OTP expired — request a new one</span>
              }
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
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

            <Input
              label="New Password"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              iconRight={<ShieldCheck className="w-4 h-4" />}
            >
              Reset Password
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0 || isResending}
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                timeLeft > 0
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-primary hover:text-primary/80'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Sending…' : timeLeft > 0 ? 'Resend available after expiry' : 'Resend OTP'}
            </button>
          </div>

          {/* Back to login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
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

export default ResetPassword;
