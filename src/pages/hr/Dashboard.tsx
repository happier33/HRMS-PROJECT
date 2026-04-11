import React, { useState, useEffect } from 'react';
import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import { SkeletonCard } from '@/components/common/Loader';
import { useUI } from '@/app/store';
import { MOCK_EMPLOYEES, MOCK_LEAVE_REQUESTS, MOCK_ATTENDANCE } from '@/services/constants';
import { formatDate, formatCurrency } from '@/utils/formatDate';
import {
  Users, UserCheck, Clock, CalendarOff, Wallet, TrendingUp,
  ArrowRight, Briefcase, Building2, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';

const HRDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { setCurrentPage } = useUI();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute stats
  const totalEmployees = MOCK_EMPLOYEES.length;
  const activeEmployees = MOCK_EMPLOYEES.filter(e => e.status === 'Active').length;
  const onLeave = MOCK_EMPLOYEES.filter(e => e.status === 'On Leave').length;
  const pendingLeaves = MOCK_LEAVE_REQUESTS.filter(l => l.status === 'Pending').length;
  const todayPresent = MOCK_ATTENDANCE.filter(a => a.date === '2026-02-10' && a.status === 'Present').length;
  const totalPayroll = MOCK_EMPLOYEES.reduce((sum, e) => sum + e.salary, 0);

  // Department distribution
  const deptData = Object.entries(
    MOCK_EMPLOYEES.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.length > 10 ? name.slice(0, 10) + '…' : name, value, fullName: name }));

  // Attendance trend (last 7 days)
  const attendanceTrend = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    const dayStr = `2026-02-${String(day).padStart(2, '0')}`;
    const dayRecords = MOCK_ATTENDANCE.filter(a => a.date === dayStr);
    return {
      day: `Feb ${day}`,
      present: dayRecords.filter(a => a.status === 'Present' || a.status === 'Remote').length,
      absent: dayRecords.filter(a => a.status === 'Absent').length,
      late: dayRecords.filter(a => a.status === 'Late').length,
    };
  });

  // Pie chart colors
  const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

  // Recent activities
  const recentActivities = [
    { text: 'Alice Johnson submitted a leave request', time: '10 min ago', type: 'leave' },
    { text: 'Payroll for January has been processed', time: '2 hours ago', type: 'payroll' },
    { text: 'New employee Jack Robinson onboarded', time: '1 day ago', type: 'employee' },
    { text: 'Attendance report generated for Week 5', time: '2 days ago', type: 'attendance' },
    { text: 'Eva Thompson returned from leave', time: '3 days ago', type: 'leave' },
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Good afternoon, HR Team</h2>
          <p className="text-white/70 mt-1">Here's what's happening with your workforce today.</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/60">Pending Approvals</p>
              <p className="text-xl font-bold">{pendingLeaves}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/60">Today's Attendance</p>
              <p className="text-xl font-bold">{todayPresent}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          change={8.2}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          change={3.1}
          icon={<UserCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="On Leave"
          value={onLeave}
          change={-12}
          icon={<CalendarOff className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(totalPayroll / 12)}
          change={5.4}
          icon={<Wallet className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader title="Attendance Trend" subtitle="Last 7 days overview" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="#4F46E5" strokeWidth={2.5} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader title="By Department" subtitle="Employee distribution" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deptData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _: string, props: any) => [value, props.payload.fullName]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader
            title="Pending Leave Requests"
            subtitle={`${pendingLeaves} awaiting approval`}
            action={
              <button
                onClick={() => setCurrentPage('leave/requests')}
                className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {MOCK_LEAVE_REQUESTS.filter(l => l.status === 'Pending').slice(0, 4).map(leave => (
              <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {leave.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{leave.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{leave.leaveType} · {leave.days} day{leave.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Badge variant="warning" dot>{leave.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest updates" />
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                    activity.type === 'leave' ? 'bg-amber-400' :
                    activity.type === 'payroll' ? 'bg-emerald-400' :
                    activity.type === 'employee' ? 'bg-indigo-400' :
                    'bg-blue-400'
                  }`} />
                  {i < recentActivities.length - 1 && (
                    <div className="absolute top-4 left-1 w-0.5 h-full bg-border" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
