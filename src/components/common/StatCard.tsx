import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-primary/10 text-primary',
  subtitle,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div className="hrms-stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {(change !== undefined || subtitle) && (
        <div className="flex items-center gap-2">
          {change !== undefined && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'text-emerald-700 bg-emerald-50' :
              isNegative ? 'text-red-700 bg-red-50' :
              'text-gray-600 bg-gray-100'
            }`}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {isNeutral && <Minus className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {changeLabel || subtitle || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
