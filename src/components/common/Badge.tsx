import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  outline: 'bg-transparent border border-border text-foreground',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  outline: 'bg-gray-400',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '', dot = false }) => {
  return (
    <span className={`hrms-badge ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;

// ── Status Badge Helper ──
export function getStatusBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'Active': 'success',
    'Present': 'success',
    'Approved': 'success',
    'Paid': 'success',
    'On Leave': 'warning',
    'Late': 'warning',
    'Pending': 'warning',
    'Processing': 'warning',
    'Probation': 'info',
    'Remote': 'info',
    'Half Day': 'info',
    'Terminated': 'danger',
    'Resigned': 'danger',
    'Absent': 'danger',
    'Rejected': 'danger',
  };
  return map[status] || 'default';
}
