/**
 * StatCard component - displays a single statistic metric
 */

import './StatCard.css';

interface StatCardProps {
  /** The value to display (e.g., "42") */
  value: number | string;
  /** The label for the stat (e.g., "Total Agents") */
  label: string;
  /** Optional icon to display */
  icon?: string;
  /** Optional additional class name */
  className?: string;
}

/**
 * StatCard component displays a single statistic in a card format
 */
export function StatCard({ value, label, icon, className = '' }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`} role="region" aria-label={`${label} statistic`}>
      {icon && <span className="stat-card-icon" aria-hidden="true">{icon}</span>}
      <div className="stat-card-content">
        <span className="stat-card-value" data-testid="stat-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

export default StatCard;
