import React from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { MOCK_EMPLOYEES, DEPARTMENTS } from '@/services/constants';
import { formatCurrency } from '@/utils/formatDate';
import { Users, DollarSign, MapPin, Building2 } from 'lucide-react';

const DepartmentsPage: React.FC = () => {
  const deptStats = DEPARTMENTS.map(dept => {
    const employees = MOCK_EMPLOYEES.filter(e => e.department === dept);
    const avgSalary = employees.length > 0
      ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length)
      : 0;
    const locations = [...new Set(employees.map(e => e.location))];
    return { name: dept, count: employees.length, avgSalary, locations };
  }).filter(d => d.count > 0);

  const colors = [
    'from-indigo-500 to-indigo-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
    'from-purple-500 to-purple-600',
    'from-cyan-500 to-cyan-600',
    'from-rose-500 to-rose-600',
    'from-blue-500 to-blue-600',
    'from-teal-500 to-teal-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Departments</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{deptStats.length} active departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {deptStats.map((dept, i) => (
          <Card key={dept.name} hover className="group overflow-hidden">
            <div className={`h-2 -mx-6 -mt-6 mb-5 bg-gradient-to-r ${colors[i % colors.length]}`} />
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {dept.locations.join(', ')}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-r ${colors[i % colors.length]} text-white`}>
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs">Employees</span>
                </div>
                <p className="text-lg font-bold text-foreground">{dept.count}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-xs">Avg. Salary</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(dept.avgSalary)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;
