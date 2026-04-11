import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import Badge, { getStatusBadgeVariant } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Card from '@/components/common/Card';
import { MOCK_EMPLOYEES, type Employee } from '@/services/constants';
import { formatDate, formatCurrency } from '@/utils/formatDate';
import { useUI } from '@/app/store';
import {
  UserPlus, Download, Mail, Phone, MapPin, Briefcase,
  Calendar, Building2, DollarSign,
} from 'lucide-react';

const EmployeesPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { addToast } = useUI();

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {row.avatar}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'id', header: 'ID', width: '100px' },
    { key: 'department', header: 'Department' },
    { key: 'position', header: 'Position' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)} dot>{row.status}</Badge>
      ),
    },
    { key: 'location', header: 'Location' },
    {
      key: 'joinDate',
      header: 'Joined',
      render: (row) => <span className="text-muted-foreground">{formatDate(row.joinDate)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Employee Directory</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{MOCK_EMPLOYEES.length} employees in your organization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('Export started. File will download shortly.', 'info')}
          >
            Export
          </Button>
          <Button
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card padding={false}>
        <div className="p-4 pb-0">
          <DataTable
            columns={columns}
            data={MOCK_EMPLOYEES}
            searchPlaceholder="Search employees by name, department, position..."
            onRowClick={(row) => setSelectedEmployee(row)}
            pageSize={8}
          />
        </div>
      </Card>

      {/* Employee Detail Modal */}
      <Modal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title="Employee Details"
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {selectedEmployee.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedEmployee.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                <Badge variant={getStatusBadgeVariant(selectedEmployee.status)} dot className="mt-1">
                  {selectedEmployee.status}
                </Badge>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <Mail className="w-4 h-4" />, label: 'Email', value: selectedEmployee.email },
                { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: selectedEmployee.phone },
                { icon: <Building2 className="w-4 h-4" />, label: 'Department', value: selectedEmployee.department },
                { icon: <Briefcase className="w-4 h-4" />, label: 'Position', value: selectedEmployee.position },
                { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: selectedEmployee.location },
                { icon: <Calendar className="w-4 h-4" />, label: 'Joined', value: formatDate(selectedEmployee.joinDate) },
                { icon: <DollarSign className="w-4 h-4" />, label: 'Salary', value: formatCurrency(selectedEmployee.salary) },
                { icon: <Briefcase className="w-4 h-4" />, label: 'Manager', value: selectedEmployee.manager },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-background text-muted-foreground">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>Close</Button>
              <Button onClick={() => { setSelectedEmployee(null); addToast('Employee profile opened for editing', 'info'); }}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        size="lg"
      >
        <AddEmployeeForm onClose={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
};

// ── Inline Add Employee Form ──
const AddEmployeeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addToast } = useUI();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: 'Engineering',
    position: '', location: '', salary: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Employee "${formData.name}" has been added successfully!`, 'success');
    onClose();
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Full Name</label>
          <input className="hrms-input" placeholder="John Doe" required value={formData.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input className="hrms-input" type="email" placeholder="john@company.com" required value={formData.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Phone</label>
          <input className="hrms-input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => update('phone', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Department</label>
          <select className="hrms-input" value={formData.department} onChange={e => update('department', e.target.value)}>
            {['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Product', 'Legal', 'Support'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Position</label>
          <input className="hrms-input" placeholder="Software Engineer" required value={formData.position} onChange={e => update('position', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Location</label>
          <input className="hrms-input" placeholder="New York" value={formData.location} onChange={e => update('location', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Annual Salary</label>
          <input className="hrms-input" type="number" placeholder="85000" value={formData.salary} onChange={e => update('salary', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Employee</Button>
      </div>
    </form>
  );
};

export default EmployeesPage;
