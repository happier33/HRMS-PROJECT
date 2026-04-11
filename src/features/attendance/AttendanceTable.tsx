import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { MOCK_ATTENDANCE, type AttendanceRecord } from '@/services/constants';
import { formatDate } from '@/utils/formatDate';
import { Download, Filter, Calendar } from 'lucide-react';
import { useUI } from '@/app/store';

const AttendanceTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { addToast } = useUI();

  const statuses = ['All', 'Present', 'Absent', 'Late', 'Half Day', 'Remote'];

  const filteredData = statusFilter === 'All'
    ? MOCK_ATTENDANCE
    : MOCK_ATTENDANCE.filter(a => a.status === statusFilter);

  // Summary stats
  const todayRecords = MOCK_ATTENDANCE.filter(a => a.date === '2026-02-10');
  const presentCount = todayRecords.filter(a => a.status === 'Present' || a.status === 'Remote').length;
  const absentCount = todayRecords.filter(a => a.status === 'Absent').length;
  const lateCount = todayRecords.filter(a => a.status === 'Late').length;

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
            {row.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium">{row.employeeName}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => formatDate(row.date),
    },
    { key: 'checkIn', header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    {
      key: 'hoursWorked',
      header: 'Hours',
      render: (row) => <span className={row.hoursWorked < 8 && row.hoursWorked > 0 ? 'text-amber-600 font-medium' : ''}>{row.hoursWorked}h</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)} dot>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Present Today', value: presentCount, total: todayRecords.length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Absent', value: absentCount, total: todayRecords.length, color: 'text-red-600 bg-red-50' },
          { label: 'Late', value: lateCount, total: todayRecords.length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Records', value: MOCK_ATTENDANCE.length, total: null, color: 'text-indigo-600 bg-indigo-50' },
        ].map(stat => (
          <div key={stat.label} className="hrms-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stat.value}
              {stat.total && <span className="text-sm font-normal text-muted-foreground">/{stat.total}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {statuses.map(status => (
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

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          <DataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Search by employee name..."
            pageSize={10}
            headerAction={
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => addToast('Attendance report exported', 'success')}
              >
                Export
              </Button>
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default AttendanceTable;
