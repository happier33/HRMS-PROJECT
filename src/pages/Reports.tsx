import React from 'react';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/common/Button';
import { useUI } from '@/app/store';
import { MOCK_EMPLOYEES, MOCK_PAYROLL } from '@/services/constants';
import { formatCurrency } from '@/utils/formatDate';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Users, DollarSign, Clock, Download, FileText,
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { addToast } = useUI();

  // Headcount by month
  const headcountTrend = [
    { month: 'Aug', count: 11 },
    { month: 'Sep', count: 12 },
    { month: 'Oct', count: 13 },
    { month: 'Nov', count: 14 },
    { month: 'Dec', count: 14 },
    { month: 'Jan', count: 15 },
    { month: 'Feb', count: 16 },
  ];

  // Salary by department
  const salaryByDept = Object.entries(
    MOCK_EMPLOYEES.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + e.salary;
      return acc;
    }, {})
  ).map(([dept, total]) => ({
    dept: dept.length > 8 ? dept.slice(0, 8) + '…' : dept,
    total: Math.round(total / 1000),
  })).sort((a, b) => b.total - a.total);

  // Turnover data
  const turnoverData = [
    { month: 'Sep', hires: 2, exits: 0 },
    { month: 'Oct', hires: 1, exits: 1 },
    { month: 'Nov', hires: 3, exits: 0 },
    { month: 'Dec', hires: 0, exits: 1 },
    { month: 'Jan', hires: 2, exits: 0 },
    { month: 'Feb', hires: 1, exits: 0 },
  ];

  // Location distribution
  const locationData = [
    { name: 'New York', value: 6, color: '#4F46E5' },
    { name: 'San Francisco', value: 4, color: '#06B6D4' },
    { name: 'Chicago', value: 3, color: '#10B981' },
    { name: 'Austin', value: 3, color: '#F59E0B' },
  ];

  const avgSalary = Math.round(MOCK_EMPLOYEES.reduce((s, e) => s + e.salary, 0) / MOCK_EMPLOYEES.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">HR Analytics & Reports</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Workforce insights and trends</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => addToast('Report exported as PDF', 'success')}>
          Export Report
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <StatCard title="Total Headcount" value={MOCK_EMPLOYEES.length} change={6.7} icon={<Users className="w-5 h-5" />} iconBg="bg-indigo-50 text-indigo-600" />
        <StatCard title="Avg. Salary" value={formatCurrency(avgSalary)} change={3.2} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Turnover Rate" value="4.2%" change={-1.5} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Avg. Tenure" value="2.8 yrs" change={0.3} icon={<Clock className="w-5 h-5" />} iconBg="bg-purple-50 text-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Headcount Trend" subtitle="Monthly employee count" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountTrend}>
                <defs>
                  <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2.5} fill="url(#hcGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Salary by Department" subtitle="Total salary cost (in $K)" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryByDept} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} stroke="#94a3b8" width={80} />
                <Tooltip formatter={(value: number) => [`$${value}K`, 'Total']} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="total" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Hires vs Exits" subtitle="Monthly workforce changes" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="hires" fill="#10B981" radius={[4, 4, 0, 0]} name="Hires" />
                <Bar dataKey="exits" fill="#EF4444" radius={[4, 4, 0, 0]} name="Exits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Employees by Location" subtitle="Office distribution" />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={locationData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {locationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {locationData.map(l => (
              <div key={l.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-muted-foreground">{l.name} ({l.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
