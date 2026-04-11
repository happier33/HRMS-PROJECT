import React, { useState, useEffect } from 'react';
import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SkeletonCard } from '@/components/common/Loader';
import { useAuth, useUI } from '@/app/store';
import {
  Clock, CalendarOff, Wallet, UserCircle, ArrowRight,
  CheckCircle, Calendar, FileText, Briefcase,
} from 'lucide-react';
import Button from '@/components/common/Button';

const EmployeeDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const { setCurrentPage } = useUI();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const leaveBalance = [
    { type: 'Annual', total: 20, used: 8, color: 'bg-indigo-500' },
    { type: 'Sick', total: 12, used: 3, color: 'bg-amber-500' },
    { type: 'Personal', total: 5, used: 1, color: 'bg-emerald-500' },
  ];

  const recentPayslips = [
    { month: 'January 2026', amount: '$8,750', status: 'Paid', date: 'Jan 31, 2026' },
    { month: 'December 2025', amount: '$8,750', status: 'Paid', date: 'Dec 31, 2025' },
    { month: 'November 2025', amount: '$9,200', status: 'Paid', date: 'Nov 30, 2025' },
  ];

  const weekAttendance = [
    { day: 'Mon', status: 'Present', hours: '9h 0m' },
    { day: 'Tue', status: 'Present', hours: '8h 45m' },
    { day: 'Wed', status: 'Remote', hours: '9h 15m' },
    { day: 'Thu', status: 'Present', hours: '8h 30m' },
    { day: 'Fri', status: 'Present', hours: '9h 0m' },
  ];

  const quickActions = [
    { label: 'Apply Leave', icon: <CalendarOff className="w-5 h-5" />, page: 'leave/apply', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'View Payslips', icon: <Wallet className="w-5 h-5" />, page: 'payroll/payslips', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'My Profile', icon: <UserCircle className="w-5 h-5" />, page: 'profile', color: 'bg-purple-50 text-purple-600' },
    { label: 'Attendance', icon: <Clock className="w-5 h-5" />, page: 'attendance/daily', color: 'bg-amber-50 text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {auth.user?.name?.split(' ')[0] || 'Employee'}</h2>
            <p className="text-white/70 mt-1">{auth.user?.position} · {auth.user?.department}</p>
            <p className="text-white/50 text-sm mt-2">Wednesday, February 11, 2026</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm text-center">
              <p className="text-xs text-white/60">Check-in</p>
              <p className="text-lg font-bold">09:00 AM</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm text-center">
              <p className="text-xs text-white/60">Hours Today</p>
              <p className="text-lg font-bold">7h 07m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => setCurrentPage(action.page)}
            className="hrms-card p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`p-3 rounded-xl ${action.color} transition-transform group-hover:scale-110`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        <StatCard
          title="Leave Balance"
          value="28 days"
          subtitle="12 used this year"
          icon={<CalendarOff className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="This Month's Pay"
          value="$8,750"
          subtitle="Paid on Jan 31"
          icon={<Wallet className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Attendance Rate"
          value="96.5%"
          change={2.1}
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Balance */}
        <Card>
          <CardHeader
            title="Leave Balance"
            subtitle="Your leave allocation"
            action={
              <Button variant="outline" size="sm" onClick={() => setCurrentPage('leave/apply')}>
                Apply Leave
              </Button>
            }
          />
          <div className="space-y-4">
            {leaveBalance.map(leave => {
              const remaining = leave.total - leave.used;
              const percentage = (leave.used / leave.total) * 100;
              return (
                <div key={leave.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{leave.type}</span>
                    <span className="text-muted-foreground">{remaining} of {leave.total} remaining</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${leave.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* This Week's Attendance */}
        <Card>
          <CardHeader title="This Week" subtitle="Your attendance record" />
          <div className="space-y-2">
            {weekAttendance.map(day => (
              <div key={day.day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground w-8">{day.day}</span>
                  <Badge variant={day.status === 'Present' ? 'success' : 'info'} dot>
                    {day.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{day.hours}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Payslips */}
      <Card>
        <CardHeader
          title="Recent Payslips"
          subtitle="Your salary history"
          action={
            <button
              onClick={() => setCurrentPage('payroll/payslips')}
              className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase">Month</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPayslips.map((slip, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{slip.month}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{slip.amount}</td>
                  <td className="px-4 py-3"><Badge variant="success" dot>{slip.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{slip.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
