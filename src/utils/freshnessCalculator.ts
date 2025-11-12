import { differenceInDays, addDays } from 'date-fns';
import {
  Coffee,
  FreshnessInfo,
  FreshnessStatus,
  BrewingMethod,
} from '../types/coffee';

/**
 * Brewing methods with their optimal freshness windows
 */
export const BREWING_METHODS: BrewingMethod[] = [
  {
    name: 'Espresso',
    optimalDaysMin: 7,
    optimalDaysMax: 21,
    description: 'Best for espresso machines, requires degassing period',
  },
  {
    name: 'Pour Over',
    optimalDaysMin: 4,
    optimalDaysMax: 14,
    description: 'Ideal for V60, Chemex, and other filter methods',
  },
  {
    name: 'French Press',
    optimalDaysMin: 5,
    optimalDaysMax: 14,
    description: 'Great for immersion brewing with bold flavors',
  },
  {
    name: 'Cold Brew',
    optimalDaysMin: 3,
    optimalDaysMax: 21,
    description: 'Long steep times work well with various freshness levels',
  },
  {
    name: 'Aeropress',
    optimalDaysMin: 4,
    optimalDaysMax: 18,
    description: 'Versatile brewing method, works across freshness range',
  },
  {
    name: 'Drip Coffee Maker',
    optimalDaysMin: 5,
    optimalDaysMax: 21,
    description: 'Standard automatic drip coffee machines',
  },
];

/**
 * Freshness thresholds in days from roast
 */
const FRESHNESS_THRESHOLDS = {
  TOO_FRESH_MAX: 3,
  PEAK_MIN: 4,
  PEAK_MAX: 14,
  GOOD_MAX: 21,
  FADING_MAX: 30,
  STALE_MIN: 31,
};

/**
 * Calculate freshness information for a coffee product
 */
export function calculateFreshness(
  coffee: Coffee,
  currentDate: Date = new Date()
): FreshnessInfo {
  const daysFromRoast = differenceInDays(currentDate, coffee.roastDate);
  const status = determineFreshnessStatus(daysFromRoast);
  const optimalBrewingMethods = getOptimalBrewingMethods(daysFromRoast);

  const info: FreshnessInfo = {
    daysFromRoast,
    status,
    statusLabel: getStatusLabel(status),
    statusColor: getStatusColor(status),
    message: generateFreshnessMessage(daysFromRoast, status),
    optimalBrewingMethods,
    consumeByDate: addDays(coffee.roastDate, FRESHNESS_THRESHOLDS.FADING_MAX),
  };

  // Add days until peak if too fresh
  if (status === FreshnessStatus.TOO_FRESH) {
    info.daysUntilPeak = FRESHNESS_THRESHOLDS.PEAK_MIN - daysFromRoast;
  }

  // Add days until stale if not already stale
  if (status !== FreshnessStatus.STALE) {
    info.daysUntilStale = FRESHNESS_THRESHOLDS.STALE_MIN - daysFromRoast;
  }

  return info;
}

/**
 * Determine freshness status based on days from roast
 */
function determineFreshnessStatus(daysFromRoast: number): FreshnessStatus {
  if (daysFromRoast <= FRESHNESS_THRESHOLDS.TOO_FRESH_MAX) {
    return FreshnessStatus.TOO_FRESH;
  }
  if (
    daysFromRoast >= FRESHNESS_THRESHOLDS.PEAK_MIN &&
    daysFromRoast <= FRESHNESS_THRESHOLDS.PEAK_MAX
  ) {
    return FreshnessStatus.PEAK;
  }
  if (daysFromRoast <= FRESHNESS_THRESHOLDS.GOOD_MAX) {
    return FreshnessStatus.GOOD;
  }
  if (daysFromRoast <= FRESHNESS_THRESHOLDS.FADING_MAX) {
    return FreshnessStatus.FADING;
  }
  return FreshnessStatus.STALE;
}

/**
 * Get human-readable status label
 */
function getStatusLabel(status: FreshnessStatus): string {
  const labels: Record<FreshnessStatus, string> = {
    [FreshnessStatus.TOO_FRESH]: 'Degassing',
    [FreshnessStatus.PEAK]: 'Peak Freshness',
    [FreshnessStatus.GOOD]: 'Good',
    [FreshnessStatus.FADING]: 'Fading',
    [FreshnessStatus.STALE]: 'Past Prime',
  };
  return labels[status];
}

/**
 * Get color code for status display
 */
function getStatusColor(status: FreshnessStatus): string {
  const colors: Record<FreshnessStatus, string> = {
    [FreshnessStatus.TOO_FRESH]: '#FFA500', // Orange
    [FreshnessStatus.PEAK]: '#00C853', // Green
    [FreshnessStatus.GOOD]: '#4CAF50', // Light Green
    [FreshnessStatus.FADING]: '#FF9800', // Amber
    [FreshnessStatus.STALE]: '#F44336', // Red
  };
  return colors[status];
}

/**
 * Generate descriptive freshness message
 */
function generateFreshnessMessage(
  daysFromRoast: number,
  status: FreshnessStatus
): string {
  switch (status) {
    case FreshnessStatus.TOO_FRESH:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago. Coffee is still degassing. Wait ${FRESHNESS_THRESHOLDS.PEAK_MIN - daysFromRoast} more day${FRESHNESS_THRESHOLDS.PEAK_MIN - daysFromRoast !== 1 ? 's' : ''} for optimal flavor.`;

    case FreshnessStatus.PEAK:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago. At peak freshness! Perfect time to enjoy this coffee.`;

    case FreshnessStatus.GOOD:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago. Still fresh and delicious. Consume within ${FRESHNESS_THRESHOLDS.FADING_MAX - daysFromRoast} days.`;

    case FreshnessStatus.FADING:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago. Freshness is fading. Best to consume within ${FRESHNESS_THRESHOLDS.STALE_MIN - daysFromRoast} day${FRESHNESS_THRESHOLDS.STALE_MIN - daysFromRoast !== 1 ? 's' : ''}.`;

    case FreshnessStatus.STALE:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago. Past optimal freshness. Flavors may be diminished.`;

    default:
      return `Roasted ${daysFromRoast} day${daysFromRoast !== 1 ? 's' : ''} ago.`;
  }
}

/**
 * Get brewing methods that are optimal for current freshness level
 */
function getOptimalBrewingMethods(daysFromRoast: number): BrewingMethod[] {
  return BREWING_METHODS.filter(
    (method) =>
      daysFromRoast >= method.optimalDaysMin &&
      daysFromRoast <= method.optimalDaysMax
  );
}

/**
 * Check if coffee should trigger a reminder notification
 */
export function shouldSendReminder(
  coffee: Coffee,
  reminderType: 'peak_freshness' | 'consume_soon' | 'last_chance',
  currentDate: Date = new Date()
): boolean {
  const daysFromRoast = differenceInDays(currentDate, coffee.roastDate);

  switch (reminderType) {
    case 'peak_freshness':
      // Send when entering peak freshness (day 4)
      return daysFromRoast === FRESHNESS_THRESHOLDS.PEAK_MIN;

    case 'consume_soon':
      // Send 5 days before stale (day 26)
      return daysFromRoast === FRESHNESS_THRESHOLDS.STALE_MIN - 5;

    case 'last_chance':
      // Send 1 day before stale (day 30)
      return daysFromRoast === FRESHNESS_THRESHOLDS.STALE_MIN - 1;

    default:
      return false;
  }
}

/**
 * Generate reminder message based on type
 */
export function generateReminderMessage(
  coffee: Coffee,
  reminderType: 'peak_freshness' | 'consume_soon' | 'last_chance'
): string {
  switch (reminderType) {
    case 'peak_freshness':
      return `Your ${coffee.name} from ${coffee.roaster} has reached peak freshness! Now is the perfect time to brew and enjoy optimal flavors.`;

    case 'consume_soon':
      return `Your ${coffee.name} from ${coffee.roaster} should be consumed soon. It has about 5 days remaining before flavors start to fade.`;

    case 'last_chance':
      return `Last chance! Your ${coffee.name} from ${coffee.roaster} will be past its prime tomorrow. Brew it today for the best experience.`;

    default:
      return `Reminder about your ${coffee.name} from ${coffee.roaster}.`;
  }
}
