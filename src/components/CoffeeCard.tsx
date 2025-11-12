import React, { useState, useEffect } from 'react';
import { Coffee } from '../types/coffee';
import { calculateFreshness } from '../utils/freshnessCalculator';
import { FreshnessIndicator } from './FreshnessIndicator';
import { BrewingTimeline } from './BrewingTimeline';
import { format } from 'date-fns';

interface CoffeeCardProps {
  coffee: Coffee;
  showTimeline?: boolean;
  className?: string;
}

/**
 * Complete coffee product card with freshness tracking
 */
export const CoffeeCard: React.FC<CoffeeCardProps> = ({
  coffee,
  showTimeline = true,
  className = '',
}) => {
  const [freshnessInfo, setFreshnessInfo] = useState(() =>
    calculateFreshness(coffee)
  );

  // Update freshness info daily
  useEffect(() => {
    const updateFreshness = () => {
      setFreshnessInfo(calculateFreshness(coffee));
    };

    // Update immediately
    updateFreshness();

    // Update every hour to keep it current
    const interval = setInterval(updateFreshness, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [coffee]);

  return (
    <div className={`coffee-card ${className}`}>
      <div className="coffee-header">
        <h2 className="coffee-name">{coffee.name}</h2>
        <div className="coffee-roaster">{coffee.roaster}</div>
      </div>

      <div className="coffee-details">
        <div className="detail-grid">
          <div className="detail">
            <span className="label">Origin:</span>
            <span className="value">{coffee.origin}</span>
          </div>
          <div className="detail">
            <span className="label">Roast Level:</span>
            <span className="value">{coffee.roastLevel}</span>
          </div>
          <div className="detail">
            <span className="label">Roast Date:</span>
            <span className="value">
              {format(coffee.roastDate, 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="detail">
            <span className="label">Weight:</span>
            <span className="value">{coffee.weight}g</span>
          </div>
        </div>

        {coffee.flavorProfile.length > 0 && (
          <div className="flavor-profile">
            <span className="label">Flavor Notes:</span>
            <div className="flavor-tags">
              {coffee.flavorProfile.map((flavor) => (
                <span key={flavor} className="flavor-tag">
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <FreshnessIndicator freshnessInfo={freshnessInfo} />

      {showTimeline && <BrewingTimeline freshnessInfo={freshnessInfo} />}
    </div>
  );
};
