import React from 'react';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import { CalendarOff, Calendar, Clock, CheckCircle } from 'lucide-react';

const LeaveBalancePage: React.FC = () => {
  const balances = [
    { type: 'Annual Leave', total: 20, used: 8, pending: 5, color: 'bg-indigo-500', bgLight: 'bg-indigo-50 text-indigo-600' },
    { type: 'Sick Leave', total: 12, used: 3, pending: 0, color: 'bg-amber-500', bgLight: 'bg-amber-50 text-amber-600' },
    { type: 'Personal Leave', total: 5, used: 1, pending: 1, color: 'bg-emerald-500', bgLight: 'bg-emerald-50 text-emerald-600' },
    { type: 'Maternity/Paternity', total: 90, used: 0, pending: 0, color: 'bg-purple-500', bgLight: 'bg-purple-50 text-purple-600' },
    { type: 'Bereavement', total: 5, used: 0, pending: 0, color: 'bg-gray-500', bgLight: 'bg-gray-50 text-gray-600' },
    { type: 'Unpaid Leave', total: 30, used: 0, pending: 0, color: 'bg-red-500', bgLight: 'bg-red-50 text-red-600' },
  ];

  const totalUsed = balances.reduce((s, b) => s + b.used, 0);
  const totalPending = balances.reduce((s, b) => s + b.pending, 0);
  const totalRemaining = balances.reduce((s, b) => s + (b.total - b.used - b.pending), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Leave Balance</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your leave allocation for 2026</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="hrms-stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-muted-foreground">Available</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalRemaining} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
        <div className="hrms-stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600"><Calendar className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-muted-foreground">Used</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalUsed} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
        <div className="hrms-stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalPending} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
      </div>

      {/* Detailed Balances */}
      <Card>
        <CardHeader title="Leave Type Breakdown" subtitle="Detailed allocation per leave type" />
        <div className="space-y-5">
          {balances.map(balance => {
            const remaining = balance.total - balance.used - balance.pending;
            const usedPct = (balance.used / balance.total) * 100;
            const pendingPct = (balance.pending / balance.total) * 100;
            return (
              <div key={balance.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${balance.color}`} />
                    <span className="text-sm font-medium text-foreground">{balance.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Used: {balance.used}</span>
                    {balance.pending > 0 && <span className="text-amber-600">Pending: {balance.pending}</span>}
                    <span className="font-semibold text-foreground">Remaining: {remaining}</span>
                    <span>/ {balance.total}</span>
                  </div>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden flex">
                  <div className={`${balance.color} transition-all duration-500`} style={{ width: `${usedPct}%` }} />
                  {balance.pending > 0 && (
                    <div className="bg-amber-400 transition-all duration-500" style={{ width: `${pendingPct}%` }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default LeaveBalancePage;
