import React from 'react';
import { FreshnessInfo, BrewingMethod } from '../types/coffee';
import { BREWING_METHODS } from '../utils/freshnessCalculator';

interface BrewingTimelineProps {
  freshnessInfo: FreshnessInfo;
  className?: string;
}

/**
 * Timeline showing optimal brewing windows for different methods
 */
export const BrewingTimeline: React.FC<BrewingTimelineProps> = ({
  freshnessInfo,
  className = '',
}) => {
  const currentDay = freshnessInfo.daysFromRoast;

  return (
    <div className={`brewing-timeline ${className}`}>
      <h3 className="timeline-title">Optimal Brewing Windows</h3>

      <div className="timeline-container">
        <div className="timeline-scale">
          <div className="scale-line"></div>
          <div className="current-day-marker" style={{ left: `${Math.min((currentDay / 30) * 100, 100)}%` }}>
            <div className="marker-dot"></div>
            <div className="marker-label">Today (Day {currentDay})</div>
          </div>
        </div>

        <div className="brewing-methods">
          {BREWING_METHODS.map((method) => (
            <BrewingMethodRow
              key={method.name}
              method={method}
              currentDay={currentDay}
              isOptimal={freshnessInfo.optimalBrewingMethods.some(
                (m) => m.name === method.name
              )}
            />
          ))}
        </div>
      </div>

      {freshnessInfo.optimalBrewingMethods.length > 0 && (
        <div className="recommended-methods">
          <h4>Recommended Right Now:</h4>
          <div className="methods-list">
            {freshnessInfo.optimalBrewingMethods.map((method) => (
              <div key={method.name} className="method-card">
                <div className="method-name">{method.name}</div>
                <div className="method-description">{method.description}</div>
                <div className="method-window">
                  Best: Days {method.optimalDaysMin}-{method.optimalDaysMax}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface BrewingMethodRowProps {
  method: BrewingMethod;
  currentDay: number;
  isOptimal: boolean;
}

const BrewingMethodRow: React.FC<BrewingMethodRowProps> = ({
  method,
  currentDay,
  isOptimal,
}) => {
  const startPercent = (method.optimalDaysMin / 30) * 100;
  const widthPercent = ((method.optimalDaysMax - method.optimalDaysMin) / 30) * 100;

  return (
    <div className={`method-row ${isOptimal ? 'optimal' : ''}`}>
      <div className="method-label">{method.name}</div>
      <div className="method-timeline">
        <div
          className="optimal-window"
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
          }}
        >
          <span className="window-label">
            {method.optimalDaysMin}-{method.optimalDaysMax} days
          </span>
        </div>
      </div>
    </div>
  );
};
