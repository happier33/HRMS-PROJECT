import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import StatCard from '@/components/common/StatCard';
import { MOCK_PAYROLL, type PayrollRecord } from '@/services/constants';
import { formatCurrency } from '@/utils/formatDate';
import { useUI } from '@/app/store';
import { Wallet, Download, DollarSign, TrendingUp, Receipt, Eye } from 'lucide-react';

const PayrollTable: React.FC = () => {
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const { addToast } = useUI();

  // Summary calculations
  const totalNetPay = MOCK_PAYROLL.reduce((sum, p) => sum + p.netPay, 0);
  const totalTax = MOCK_PAYROLL.reduce((sum, p) => sum + p.tax, 0);
  const totalBonus = MOCK_PAYROLL.reduce((sum, p) => sum + p.bonus, 0);
  const paidCount = MOCK_PAYROLL.filter(p => p.status === 'Paid').length;

  const columns: Column<PayrollRecord>[] = [
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
    { key: 'id', header: 'Payroll ID', width: '110px' },
    {
      key: 'baseSalary',
      header: 'Base Salary',
      render: (row) => formatCurrency(row.baseSalary),
    },
    {
      key: 'bonus',
      header: 'Bonus',
      render: (row) => <span className="text-emerald-600 font-medium">+{formatCurrency(row.bonus)}</span>,
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (row) => <span className="text-red-600">-{formatCurrency(row.deductions)}</span>,
    },
    {
      key: 'tax',
      header: 'Tax',
      render: (row) => <span className="text-amber-600">-{formatCurrency(row.tax)}</span>,
    },
    {
      key: 'netPay',
      header: 'Net Pay',
      render: (row) => <span className="font-bold text-foreground">{formatCurrency(row.netPay)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)} dot>{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      width: '60px',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedPayroll(row); }}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <StatCard
          title="Total Net Pay"
          value={formatCurrency(totalNetPay)}
          change={5.2}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total Tax"
          value={formatCurrency(totalTax)}
          change={-2.1}
          icon={<Receipt className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Total Bonuses"
          value={formatCurrency(totalBonus)}
          change={15}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Processed"
          value={`${paidCount}/${MOCK_PAYROLL.length}`}
          subtitle="Payslips paid this month"
          icon={<Wallet className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          <DataTable
            columns={columns}
            data={MOCK_PAYROLL}
            searchPlaceholder="Search payroll records..."
            pageSize={8}
            onRowClick={(row) => setSelectedPayroll(row)}
            headerAction={
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => addToast('Payroll report exported successfully', 'success')}
              >
                Export Report
              </Button>
            }
          />
        </div>
      </Card>

      {/* Payroll Detail Modal */}
      <Modal
        isOpen={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        title="Payslip Details"
        size="md"
      >
        {selectedPayroll && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                {selectedPayroll.employeeName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedPayroll.employeeName}</h3>
                <p className="text-sm text-muted-foreground">{selectedPayroll.department} · {selectedPayroll.month}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Base Salary', value: formatCurrency(selectedPayroll.baseSalary), type: 'neutral' },
                { label: 'Bonus', value: `+${formatCurrency(selectedPayroll.bonus)}`, type: 'positive' },
                { label: 'Deductions', value: `-${formatCurrency(selectedPayroll.deductions)}`, type: 'negative' },
                { label: 'Tax', value: `-${formatCurrency(selectedPayroll.tax)}`, type: 'negative' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-semibold ${
                    item.type === 'positive' ? 'text-emerald-600' :
                    item.type === 'negative' ? 'text-red-600' :
                    'text-foreground'
                  }`}>{item.value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Net Pay</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(selectedPayroll.netPay)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge variant={getStatusBadgeVariant(selectedPayroll.status)} dot>{selectedPayroll.status}</Badge>
              <Button size="sm" icon={<Download className="w-4 h-4" />} onClick={() => addToast('Payslip downloaded', 'success')}>
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayrollTable;
