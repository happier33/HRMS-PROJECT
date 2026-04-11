import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = true, hover = false }) => (
  <div className={`hrms-card ${padding ? 'p-6' : ''} ${hover ? 'cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;

// ── Card Header ──
export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ── Empty State ──
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {icon && <div className="mb-4 text-muted-foreground/50">{icon}</div>}
    <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
    {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
