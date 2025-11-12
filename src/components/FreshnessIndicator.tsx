import React from 'react';
import { FreshnessInfo } from '../types/coffee';
import { format } from 'date-fns';

interface FreshnessIndicatorProps {
  freshnessInfo: FreshnessInfo;
  className?: string;
}

/**
 * Visual indicator showing coffee freshness status
 */
export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({
  freshnessInfo,
  className = '',
}) => {
  return (
    <div className={`freshness-indicator ${className}`}>
      <div className="freshness-header">
        <div
          className="status-badge"
          style={{ backgroundColor: freshnessInfo.statusColor }}
        >
          {freshnessInfo.statusLabel}
        </div>
        <div className="days-count">
          Day {freshnessInfo.daysFromRoast} from roast
        </div>
      </div>

      <div className="freshness-message">{freshnessInfo.message}</div>

      <div className="freshness-details">
        {freshnessInfo.daysUntilPeak !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Peak freshness in:</span>
            <span className="detail-value">
              {freshnessInfo.daysUntilPeak} day
              {freshnessInfo.daysUntilPeak !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {freshnessInfo.daysUntilStale !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Best consumed within:</span>
            <span className="detail-value">
              {freshnessInfo.daysUntilStale} day
              {freshnessInfo.daysUntilStale !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="detail-item">
          <span className="detail-label">Consume by:</span>
          <span className="detail-value">
            {format(freshnessInfo.consumeByDate, 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};
