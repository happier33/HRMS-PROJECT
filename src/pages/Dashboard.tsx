import React, { useState, useEffect } from 'react';
import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SkeletonCard } from '@/components/common/Loader';
import { MOCK_EMPLOYEES } from '@/services/constants';
import { formatCurrency } from '@/utils/formatDate';
import {
  Users, Shield, Server, Activity, Globe, Database,
  HardDrive, Cpu, ArrowRight, CheckCircle, AlertTriangle, XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // System metrics
  const usersByRole = [
    { name: 'Admins', value: 3, color: '#8B5CF6' },
    { name: 'HR', value: 5, color: '#3B82F6' },
    { name: 'Employees', value: MOCK_EMPLOYEES.length, color: '#10B981' },
  ];

  const monthlyLogins = [
    { month: 'Sep', logins: 1240 },
    { month: 'Oct', logins: 1380 },
    { month: 'Nov', logins: 1520 },
    { month: 'Dec', logins: 1100 },
    { month: 'Jan', logins: 1680 },
    { month: 'Feb', logins: 890 },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'Healthy', uptime: '99.98%', icon: <Server className="w-4 h-4" /> },
    { name: 'Database', status: 'Healthy', uptime: '99.99%', icon: <Database className="w-4 h-4" /> },
    { name: 'Storage', status: 'Warning', uptime: '98.5%', icon: <HardDrive className="w-4 h-4" /> },
    { name: 'CDN', status: 'Healthy', uptime: '100%', icon: <Globe className="w-4 h-4" /> },
  ];

  const auditLogs = [
    { action: 'User Login', user: 'Sarah Mitchell', role: 'ADMIN', time: '2 min ago', status: 'success' },
    { action: 'Employee Created', user: 'James Rodriguez', role: 'HR', time: '15 min ago', status: 'success' },
    { action: 'Payroll Processed', user: 'System', role: 'SYSTEM', time: '1 hour ago', status: 'success' },
    { action: 'Failed Login Attempt', user: 'Unknown', role: 'N/A', time: '2 hours ago', status: 'error' },
    { action: 'Settings Updated', user: 'Sarah Mitchell', role: 'ADMIN', time: '3 hours ago', status: 'success' },
    { action: 'Backup Completed', user: 'System', role: 'SYSTEM', time: '6 hours ago', status: 'success' },
    { action: 'Permission Changed', user: 'Sarah Mitchell', role: 'ADMIN', time: '1 day ago', status: 'warning' },
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
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">System Administration</h2>
          <p className="text-white/70 mt-1">Monitor system health, user activity, and security metrics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <StatCard
          title="Total Users"
          value={MOCK_EMPLOYEES.length + 8}
          change={12.5}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Active Sessions"
          value={42}
          change={8}
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="System Uptime"
          value="99.97%"
          change={0.02}
          icon={<Server className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Security Score"
          value="A+"
          subtitle="No threats detected"
          icon={<Shield className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Login Trends */}
        <Card className="lg:col-span-2">
          <CardHeader title="Login Activity" subtitle="Monthly login trends" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLogins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="logins" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader title="Users by Role" subtitle="Role distribution" />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usersByRole}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {usersByRole.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {usersByRole.map(r => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-muted-foreground">{r.name} ({r.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader title="System Health" subtitle="Infrastructure status" />
          <div className="space-y-3">
            {systemHealth.map(service => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    service.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {service.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <Badge variant={service.status === 'Healthy' ? 'success' : 'warning'} dot>
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader title="Audit Log" subtitle="Recent system events" />
          <div className="space-y-3">
            {auditLogs.slice(0, 6).map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${
                    log.status === 'success' ? 'text-emerald-500' :
                    log.status === 'error' ? 'text-red-500' :
                    'text-amber-500'
                  }`}>
                    {log.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     log.status === 'error' ? <XCircle className="w-4 h-4" /> :
                     <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.user} · {log.role}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
