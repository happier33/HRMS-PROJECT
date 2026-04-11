/**
 * HRMS Constants & Mock Data
 */
import type { User } from '@/app/store';

// ── Mock Users for Authentication ──
export const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@hrms.com': {
    id: 'USR-001',
    name: 'Sarah Mitchell',
    email: 'admin@hrms.com',
    role: 'ADMIN',
    avatar: 'SM',
    department: 'Administration',
    position: 'System Administrator',
    password: 'admin123',
  },
  'hr@hrms.com': {
    id: 'USR-002',
    name: 'James Rodriguez',
    email: 'hr@hrms.com',
    role: 'HR',
    avatar: 'JR',
    department: 'Human Resources',
    position: 'HR Manager',
    password: 'hr123',
  },
  'employee@hrms.com': {
    id: 'USR-003',
    name: 'Emily Chen',
    email: 'employee@hrms.com',
    role: 'EMPLOYEE',
    avatar: 'EC',
    department: 'Engineering',
    position: 'Senior Developer',
    password: 'emp123',
  },
};

// ── Departments ──
export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Legal',
  'Customer Support',
] as const;

// ── Employee Statuses ──
export const EMPLOYEE_STATUSES = ['Active', 'On Leave', 'Probation', 'Terminated', 'Resigned'] as const;

// ── Leave Types ──
export const LEAVE_TYPES = ['Annual', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Unpaid', 'Bereavement'] as const;

// ── Mock Employees ──
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
  salary: number;
  avatar: string;
  manager: string;
  location: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Alice Johnson', email: 'alice@hrms.com', phone: '+1 (555) 101-2001', department: 'Engineering', position: 'Lead Developer', status: 'Active', joinDate: '2021-03-15', salary: 125000, avatar: 'AJ', manager: 'David Kim', location: 'New York' },
  { id: 'EMP-002', name: 'Bob Williams', email: 'bob@hrms.com', phone: '+1 (555) 101-2002', department: 'Engineering', position: 'Backend Developer', status: 'Active', joinDate: '2022-01-10', salary: 105000, avatar: 'BW', manager: 'Alice Johnson', location: 'New York' },
  { id: 'EMP-003', name: 'Carol Davis', email: 'carol@hrms.com', phone: '+1 (555) 101-2003', department: 'Design', position: 'UI/UX Designer', status: 'Active', joinDate: '2021-07-22', salary: 95000, avatar: 'CD', manager: 'Lisa Park', location: 'San Francisco' },
  { id: 'EMP-004', name: 'Daniel Martinez', email: 'daniel@hrms.com', phone: '+1 (555) 101-2004', department: 'Marketing', position: 'Marketing Manager', status: 'Active', joinDate: '2020-11-05', salary: 110000, avatar: 'DM', manager: 'Sarah Mitchell', location: 'Chicago' },
  { id: 'EMP-005', name: 'Eva Thompson', email: 'eva@hrms.com', phone: '+1 (555) 101-2005', department: 'Sales', position: 'Sales Representative', status: 'On Leave', joinDate: '2023-02-14', salary: 75000, avatar: 'ET', manager: 'Michael Brown', location: 'Austin' },
  { id: 'EMP-006', name: 'Frank Garcia', email: 'frank@hrms.com', phone: '+1 (555) 101-2006', department: 'Finance', position: 'Financial Analyst', status: 'Active', joinDate: '2022-06-01', salary: 92000, avatar: 'FG', manager: 'Nancy White', location: 'New York' },
  { id: 'EMP-007', name: 'Grace Lee', email: 'grace@hrms.com', phone: '+1 (555) 101-2007', department: 'Human Resources', position: 'HR Specialist', status: 'Active', joinDate: '2021-09-18', salary: 82000, avatar: 'GL', manager: 'James Rodriguez', location: 'Chicago' },
  { id: 'EMP-008', name: 'Henry Wilson', email: 'henry@hrms.com', phone: '+1 (555) 101-2008', department: 'Operations', position: 'Operations Lead', status: 'Active', joinDate: '2020-04-12', salary: 98000, avatar: 'HW', manager: 'Sarah Mitchell', location: 'San Francisco' },
  { id: 'EMP-009', name: 'Iris Patel', email: 'iris@hrms.com', phone: '+1 (555) 101-2009', department: 'Product', position: 'Product Manager', status: 'Active', joinDate: '2022-08-25', salary: 115000, avatar: 'IP', manager: 'David Kim', location: 'Austin' },
  { id: 'EMP-010', name: 'Jack Robinson', email: 'jack@hrms.com', phone: '+1 (555) 101-2010', department: 'Engineering', position: 'Frontend Developer', status: 'Probation', joinDate: '2024-01-08', salary: 88000, avatar: 'JR', manager: 'Alice Johnson', location: 'New York' },
  { id: 'EMP-011', name: 'Karen Nguyen', email: 'karen@hrms.com', phone: '+1 (555) 101-2011', department: 'Legal', position: 'Legal Counsel', status: 'Active', joinDate: '2021-05-30', salary: 130000, avatar: 'KN', manager: 'Sarah Mitchell', location: 'Chicago' },
  { id: 'EMP-012', name: 'Leo Anderson', email: 'leo@hrms.com', phone: '+1 (555) 101-2012', department: 'Customer Support', position: 'Support Lead', status: 'Active', joinDate: '2022-03-17', salary: 72000, avatar: 'LA', manager: 'Henry Wilson', location: 'Austin' },
  { id: 'EMP-013', name: 'Maya Scott', email: 'maya@hrms.com', phone: '+1 (555) 101-2013', department: 'Design', position: 'Graphic Designer', status: 'Active', joinDate: '2023-06-12', salary: 78000, avatar: 'MS', manager: 'Lisa Park', location: 'San Francisco' },
  { id: 'EMP-014', name: 'Nathan Clark', email: 'nathan@hrms.com', phone: '+1 (555) 101-2014', department: 'Engineering', position: 'DevOps Engineer', status: 'Active', joinDate: '2022-11-20', salary: 112000, avatar: 'NC', manager: 'Alice Johnson', location: 'New York' },
  { id: 'EMP-015', name: 'Olivia Turner', email: 'olivia@hrms.com', phone: '+1 (555) 101-2015', department: 'Marketing', position: 'Content Strategist', status: 'Active', joinDate: '2023-04-03', salary: 85000, avatar: 'OT', manager: 'Daniel Martinez', location: 'Chicago' },
  { id: 'EMP-016', name: 'Peter Adams', email: 'peter@hrms.com', phone: '+1 (555) 101-2016', department: 'Sales', position: 'Sales Manager', status: 'Active', joinDate: '2020-08-14', salary: 118000, avatar: 'PA', manager: 'Sarah Mitchell', location: 'Austin' },
];

// ── Mock Payroll Data ──
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paidDate: string | null;
}

export const MOCK_PAYROLL: PayrollRecord[] = MOCK_EMPLOYEES.map((emp, i) => {
  const bonus = Math.floor(Math.random() * 5000);
  const deductions = Math.floor(emp.salary * 0.05 / 12);
  const tax = Math.floor(emp.salary * 0.22 / 12);
  const baseMonthlySalary = Math.floor(emp.salary / 12);
  const netPay = baseMonthlySalary + bonus - deductions - tax;
  const statuses: Array<'Paid' | 'Pending' | 'Processing'> = ['Paid', 'Pending', 'Processing'];
  return {
    id: `PAY-${String(i + 1).padStart(3, '0')}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    month: 'January 2026',
    baseSalary: baseMonthlySalary,
    bonus,
    deductions,
    tax,
    netPay,
    status: i < 12 ? 'Paid' : statuses[i % 3],
    paidDate: i < 12 ? '2026-01-31' : null,
  };
});

// ── Mock Attendance Data ──
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Remote';
  hoursWorked: number;
}

const attendanceStatuses: Array<'Present' | 'Absent' | 'Late' | 'Half Day' | 'Remote'> = ['Present', 'Present', 'Present', 'Late', 'Remote', 'Present', 'Half Day', 'Absent'];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
for (let day = 1; day <= 10; day++) {
  MOCK_EMPLOYEES.slice(0, 10).forEach((emp, i) => {
    const status = attendanceStatuses[(day + i) % attendanceStatuses.length];
    const checkIn = status === 'Absent' ? '--' : status === 'Late' ? '10:15 AM' : '09:00 AM';
    const checkOut = status === 'Absent' ? '--' : status === 'Half Day' ? '01:00 PM' : '06:00 PM';
    const hours = status === 'Absent' ? 0 : status === 'Half Day' ? 4 : status === 'Late' ? 7.75 : 9;
    MOCK_ATTENDANCE.push({
      id: `ATT-${String(MOCK_ATTENDANCE.length + 1).padStart(4, '0')}`,
      employeeId: emp.id,
      employeeName: emp.name,
      date: `2026-02-${String(day).padStart(2, '0')}`,
      checkIn,
      checkOut,
      status,
      hoursWorked: hours,
    });
  });
}

// ── Mock Leave Requests ──
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'EMP-005', employeeName: 'Eva Thompson', department: 'Sales', leaveType: 'Annual', startDate: '2026-02-15', endDate: '2026-02-20', days: 4, reason: 'Family vacation', status: 'Approved', appliedDate: '2026-02-01' },
  { id: 'LV-002', employeeId: 'EMP-003', employeeName: 'Carol Davis', department: 'Design', leaveType: 'Sick', startDate: '2026-02-12', endDate: '2026-02-13', days: 2, reason: 'Medical appointment', status: 'Approved', appliedDate: '2026-02-10' },
  { id: 'LV-003', employeeId: 'EMP-008', employeeName: 'Henry Wilson', department: 'Operations', leaveType: 'Personal', startDate: '2026-02-25', endDate: '2026-02-26', days: 2, reason: 'Personal matters', status: 'Pending', appliedDate: '2026-02-08' },
  { id: 'LV-004', employeeId: 'EMP-001', employeeName: 'Alice Johnson', department: 'Engineering', leaveType: 'Annual', startDate: '2026-03-01', endDate: '2026-03-07', days: 5, reason: 'Spring break trip', status: 'Pending', appliedDate: '2026-02-09' },
  { id: 'LV-005', employeeId: 'EMP-012', employeeName: 'Leo Anderson', department: 'Customer Support', leaveType: 'Sick', startDate: '2026-02-10', endDate: '2026-02-10', days: 1, reason: 'Feeling unwell', status: 'Approved', appliedDate: '2026-02-10' },
  { id: 'LV-006', employeeId: 'EMP-009', employeeName: 'Iris Patel', department: 'Product', leaveType: 'Maternity', startDate: '2026-04-01', endDate: '2026-06-30', days: 65, reason: 'Maternity leave', status: 'Approved', appliedDate: '2026-01-15' },
  { id: 'LV-007', employeeId: 'EMP-014', employeeName: 'Nathan Clark', department: 'Engineering', leaveType: 'Personal', startDate: '2026-02-18', endDate: '2026-02-18', days: 1, reason: 'Moving to new apartment', status: 'Pending', appliedDate: '2026-02-11' },
  { id: 'LV-008', employeeId: 'EMP-006', employeeName: 'Frank Garcia', department: 'Finance', leaveType: 'Annual', startDate: '2026-03-15', endDate: '2026-03-22', days: 6, reason: 'International travel', status: 'Rejected', appliedDate: '2026-02-05' },
];

// ── Sidebar Menu Configuration ──
export interface SubMenuItem {
  label: string;
  page: string;
  icon: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  page?: string;
  subItems?: SubMenuItem[];
  roles: Array<'ADMIN' | 'HR' | 'DEMOADMIN' | 'EMPLOYEE'>;
}

export const SIDEBAR_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    page: 'dashboard',
    roles: ['ADMIN', 'HR', 'DEMOADMIN', 'EMPLOYEE'],
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: 'Users',
    roles: ['ADMIN', 'HR', 'DEMOADMIN'],
    subItems: [
      { label: 'Employee List', page: 'employees/list', icon: 'List', description: 'View all employees' },
      { label: 'Add Employee', page: 'employees/add', icon: 'UserPlus', description: 'Register new employee' },
      { label: 'Departments', page: 'employees/departments', icon: 'Building2', description: 'Manage departments' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'Clock',
    roles: ['ADMIN', 'HR', 'DEMOADMIN', 'EMPLOYEE'],
    subItems: [
      { label: 'Daily Log', page: 'attendance/daily', icon: 'CalendarDays', description: 'Today\'s attendance' },
      { label: 'Reports', page: 'attendance/reports', icon: 'BarChart3', description: 'Attendance analytics' },
    ],
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: 'CalendarOff',
    roles: ['ADMIN', 'HR', 'DEMOADMIN', 'EMPLOYEE'],
    subItems: [
      { label: 'Requests', page: 'leave/requests', icon: 'FileText', description: 'Leave applications' },
      { label: 'Apply Leave', page: 'leave/apply', icon: 'PlusCircle', description: 'Submit new request' },
      { label: 'Balance', page: 'leave/balance', icon: 'PieChart', description: 'Leave balances' },
    ],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: 'Wallet',
    roles: ['ADMIN', 'HR', 'DEMOADMIN'],
    subItems: [
      { label: 'Payroll List', page: 'payroll/list', icon: 'Receipt', description: 'Monthly payroll' },
      { label: 'Payslips', page: 'payroll/payslips', icon: 'FileSpreadsheet', description: 'Generate payslips' },
    ],
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'UserCircle',
    page: 'profile',
    roles: ['ADMIN', 'HR', 'DEMOADMIN', 'EMPLOYEE'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'TrendingUp',
    page: 'reports',
    roles: ['ADMIN', 'HR', 'DEMOADMIN'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    page: 'settings',
    roles: ['ADMIN', 'HR', 'DEMOADMIN'],
    subItems:[
      {
        label: 'Users', page: 'users/list', icon: 'list', description: 'View all  users' 
      },
      {
        label: 'Roles', page: 'roles/list', icon: 'list', description: 'View all roles'
      },
      {
        label: 'Permissions', page: 'permissions/list', icon: 'list', description: 'View all permissions'
      }
    ]
  },
];
