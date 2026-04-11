import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { MOCK_LEAVE_REQUESTS, LEAVE_TYPES, type LeaveRequest as LeaveRequestType } from '@/services/constants';
import { formatDate } from '@/utils/formatDate';
import { useAuth, useUI } from '@/app/store';
import { PlusCircle, CheckCircle, XCircle, Calendar, FileText } from 'lucide-react';

const LeaveRequestPage: React.FC = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveData, setLeaveData] = useState(MOCK_LEAVE_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { auth } = useAuth();
  const { addToast } = useUI();

  const isHROrAdmin = auth.user?.role === 'HR' || auth.user?.role === 'ADMIN';

  const filteredData = statusFilter === 'All'
    ? leaveData
    : leaveData.filter(l => l.status === statusFilter);

  const handleApprove = (id: string) => {
    setLeaveData(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' as const } : l));
    addToast('Leave request approved', 'success');
  };

  const handleReject = (id: string) => {
    setLeaveData(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' as const } : l));
    addToast('Leave request rejected', 'warning');
  };

  const columns: Column<LeaveRequestType>[] = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
            {row.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.employeeName}</p>
            <p className="text-xs text-muted-foreground">{row.department}</p>
          </div>
        </div>
      ),
    },
    { key: 'leaveType', header: 'Type' },
    {
      key: 'startDate',
      header: 'Period',
      render: (row) => (
        <span className="text-sm">{formatDate(row.startDate)} — {formatDate(row.endDate)}</span>
      ),
    },
    {
      key: 'days',
      header: 'Days',
      render: (row) => <span className="font-semibold">{row.days}</span>,
    },
    { key: 'reason', header: 'Reason' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)} dot>{row.status}</Badge>,
    },
    ...(isHROrAdmin ? [{
      key: 'actions' as string,
      header: 'Actions',
      sortable: false,
      render: (row: LeaveRequestType) => row.status === 'Pending' ? (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleApprove(row.id); }}
            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
            title="Approve"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleReject(row.id); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    }] : []),
  ];

  // Summary
  const pending = leaveData.filter(l => l.status === 'Pending').length;
  const approved = leaveData.filter(l => l.status === 'Approved').length;
  const rejected = leaveData.filter(l => l.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: leaveData.length, color: 'text-indigo-600' },
          { label: 'Pending', value: pending, color: 'text-amber-600' },
          { label: 'Approved', value: approved, color: 'text-emerald-600' },
          { label: 'Rejected', value: rejected, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="hrms-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Button size="sm" icon={<PlusCircle className="w-4 h-4" />} onClick={() => setShowApplyModal(true)}>
          Apply Leave
        </Button>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          <DataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Search leave requests..."
            pageSize={8}
          />
        </div>
      </Card>

      {/* Apply Leave Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Leave" size="md">
        <ApplyLeaveForm onClose={() => setShowApplyModal(false)} />
      </Modal>
    </div>
  );
};

// ── Apply Leave Form ──
const ApplyLeaveForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addToast } = useUI();
  const [form, setForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Leave request submitted successfully!', 'success');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Leave Type</label>
        <select className="hrms-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
          {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Start Date</label>
          <input type="date" className="hrms-input" required value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">End Date</label>
          <input type="date" className="hrms-input" required value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Reason</label>
        <textarea className="hrms-input min-h-[80px] resize-none" placeholder="Briefly describe the reason..." required value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit Request</Button>
      </div>
    </form>
  );
};

export default LeaveRequestPage;
