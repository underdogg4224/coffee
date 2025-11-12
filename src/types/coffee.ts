/**
 * Coffee product data model with roast tracking
 */
export interface Coffee {
  id: string;
  name: string;
  roaster: string;
  roastDate: Date;
  origin: string;
  roastLevel: 'light' | 'medium' | 'medium-dark' | 'dark';
  flavorProfile: string[];
  weight: number; // in grams
  purchaseDate?: Date;
}

/**
 * Brewing method with optimal freshness windows
 */
export interface BrewingMethod {
  name: string;
  optimalDaysMin: number;
  optimalDaysMax: number;
  description: string;
}

/**
 * Freshness status categories
 */
export enum FreshnessStatus {
  TOO_FRESH = 'too_fresh',
  PEAK = 'peak',
  GOOD = 'good',
  FADING = 'fading',
  STALE = 'stale',
}

/**
 * Freshness information for a coffee product
 */
export interface FreshnessInfo {
  daysFromRoast: number;
  status: FreshnessStatus;
  statusLabel: string;
  statusColor: string;
  message: string;
  optimalBrewingMethods: BrewingMethod[];
  daysUntilPeak?: number;
  daysUntilStale?: number;
  consumeByDate: Date;
}

/**
 * Notification/reminder configuration
 */
export interface FreshnessReminder {
  coffeeId: string;
  type: 'peak_freshness' | 'consume_soon' | 'last_chance';
  scheduledDate: Date;
  message: string;
  sent: boolean;
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  peakFreshnessReminder: boolean;
  consumeSoonReminder: boolean; // 5 days before stale
  lastChanceReminder: boolean; // 1 day before stale
}
