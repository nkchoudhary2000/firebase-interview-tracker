import React from 'react';
import { STATUS_CONFIG, APPLICATION_STATUS, ROUND_STATUS_CONFIG } from '../../types/interview';

export const Badge = ({ status, size = 'md', className = '' }) => {
  const config = STATUS_CONFIG[status] || ROUND_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
};
