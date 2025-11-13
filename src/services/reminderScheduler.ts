import { addDays, isSameDay } from 'date-fns';
import {
  Coffee,
  FreshnessReminder,
  NotificationPreferences,
} from '../types/coffee';
import {
  shouldSendReminder,
  generateReminderMessage,
} from '../utils/freshnessCalculator';
import { NotificationService } from './notificationService';

/**
 * Scheduler for managing coffee freshness reminders
 */
export class ReminderScheduler {
  private reminders: Map<string, FreshnessReminder[]> = new Map();
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  /**
   * Schedule reminders for a coffee product
   */
  scheduleReminders(
    coffee: Coffee,
    preferences: NotificationPreferences
  ): FreshnessReminder[] {
    const reminders: FreshnessReminder[] = [];

    // Schedule peak freshness reminder (day 4)
    if (preferences.peakFreshnessReminder) {
      reminders.push({
        coffeeId: coffee.id,
        type: 'peak_freshness',
        scheduledDate: addDays(coffee.roastDate, 4),
        message: generateReminderMessage(coffee, 'peak_freshness'),
        sent: false,
      });
    }

    // Schedule consume soon reminder (day 26)
    if (preferences.consumeSoonReminder) {
      reminders.push({
        coffeeId: coffee.id,
        type: 'consume_soon',
        scheduledDate: addDays(coffee.roastDate, 26),
        message: generateReminderMessage(coffee, 'consume_soon'),
        sent: false,
      });
    }

    // Schedule last chance reminder (day 30)
    if (preferences.lastChanceReminder) {
      reminders.push({
        coffeeId: coffee.id,
        type: 'last_chance',
        scheduledDate: addDays(coffee.roastDate, 30),
        message: generateReminderMessage(coffee, 'last_chance'),
        sent: false,
      });
    }

    this.reminders.set(coffee.id, reminders);
    return reminders;
  }

  /**
   * Get all scheduled reminders for a coffee
   */
  getReminders(coffeeId: string): FreshnessReminder[] {
    return this.reminders.get(coffeeId) || [];
  }

  /**
   * Get all pending reminders across all coffees
   */
  getAllPendingReminders(): FreshnessReminder[] {
    const allReminders: FreshnessReminder[] = [];

    for (const reminders of this.reminders.values()) {
      allReminders.push(...reminders.filter((r) => !r.sent));
    }

    return allReminders;
  }

  /**
   * Check and send due reminders
   */
  async checkAndSendReminders(
    coffees: Map<string, Coffee>,
    userPreferences: Map<string, NotificationPreferences>,
    userEmails: Map<string, string>,
    pushTokens: Map<string, string>,
    currentDate: Date = new Date()
  ): Promise<FreshnessReminder[]> {
    const sentReminders: FreshnessReminder[] = [];

    for (const [coffeeId, reminders] of this.reminders.entries()) {
      const coffee = coffees.get(coffeeId);
      if (!coffee) continue;

      for (const reminder of reminders) {
        // Skip if already sent
        if (reminder.sent) continue;

        // Check if reminder is due today
        if (isSameDay(reminder.scheduledDate, currentDate)) {
          const preferences = userPreferences.get(coffeeId);
          if (!preferences) continue;

          // Check if this type of reminder is enabled
          const isEnabled = this.isReminderEnabled(reminder.type, preferences);
          if (!isEnabled) continue;

          try {
            await this.notificationService.sendReminder(
              coffee,
              reminder,
              preferences,
              userEmails.get(coffeeId),
              pushTokens.get(coffeeId)
            );

            reminder.sent = true;
            sentReminders.push(reminder);
          } catch (error) {
            console.error(
              `Failed to send reminder for coffee ${coffeeId}:`,
              error
            );
          }
        }
      }
    }

    return sentReminders;
  }

  /**
   * Check if a specific reminder type is enabled
   */
  private isReminderEnabled(
    type: 'peak_freshness' | 'consume_soon' | 'last_chance',
    preferences: NotificationPreferences
  ): boolean {
    switch (type) {
      case 'peak_freshness':
        return preferences.peakFreshnessReminder;
      case 'consume_soon':
        return preferences.consumeSoonReminder;
      case 'last_chance':
        return preferences.lastChanceReminder;
      default:
        return false;
    }
  }

  /**
   * Cancel all reminders for a coffee
   */
  cancelReminders(coffeeId: string): void {
    this.reminders.delete(coffeeId);
  }

  /**
   * Clear all reminders
   */
  clearAllReminders(): void {
    this.reminders.clear();
  }

  /**
   * Get reminder statistics
   */
  getStats(): {
    totalReminders: number;
    pendingReminders: number;
    sentReminders: number;
  } {
    let total = 0;
    let pending = 0;
    let sent = 0;

    for (const reminders of this.reminders.values()) {
      total += reminders.length;
      pending += reminders.filter((r) => !r.sent).length;
      sent += reminders.filter((r) => r.sent).length;
    }

    return {
      totalReminders: total,
      pendingReminders: pending,
      sentReminders: sent,
    };
  }
}
