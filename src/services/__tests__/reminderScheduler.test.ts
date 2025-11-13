import { addDays } from 'date-fns';
import { ReminderScheduler } from '../reminderScheduler';
import {
  NotificationService,
  ConsoleEmailProvider,
  ConsolePushProvider,
} from '../notificationService';
import { Coffee, NotificationPreferences } from '../../types/coffee';

describe('ReminderScheduler', () => {
  let scheduler: ReminderScheduler;
  let notificationService: NotificationService;

  const mockCoffee: Coffee = {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    roaster: 'Counter Culture Coffee',
    roastDate: new Date('2025-11-01'),
    origin: 'Ethiopia',
    roastLevel: 'light',
    flavorProfile: ['Blueberry', 'Floral', 'Citrus'],
    weight: 340,
  };

  const mockPreferences: NotificationPreferences = {
    email: true,
    push: true,
    peakFreshnessReminder: true,
    consumeSoonReminder: true,
    lastChanceReminder: true,
  };

  beforeEach(() => {
    notificationService = new NotificationService(
      new ConsoleEmailProvider(),
      new ConsolePushProvider()
    );
    scheduler = new ReminderScheduler(notificationService);
  });

  describe('scheduleReminders', () => {
    it('should schedule all three reminders when all preferences are enabled', () => {
      const reminders = scheduler.scheduleReminders(mockCoffee, mockPreferences);

      expect(reminders).toHaveLength(3);
      expect(reminders.map((r) => r.type)).toContain('peak_freshness');
      expect(reminders.map((r) => r.type)).toContain('consume_soon');
      expect(reminders.map((r) => r.type)).toContain('last_chance');
    });

    it('should schedule peak_freshness reminder for day 4', () => {
      const reminders = scheduler.scheduleReminders(mockCoffee, mockPreferences);
      const peakReminder = reminders.find((r) => r.type === 'peak_freshness');

      expect(peakReminder).toBeDefined();
      expect(peakReminder?.scheduledDate.getTime()).toBe(
        addDays(mockCoffee.roastDate, 4).getTime()
      );
    });

    it('should schedule consume_soon reminder for day 26', () => {
      const reminders = scheduler.scheduleReminders(mockCoffee, mockPreferences);
      const consumeReminder = reminders.find((r) => r.type === 'consume_soon');

      expect(consumeReminder).toBeDefined();
      expect(consumeReminder?.scheduledDate.getTime()).toBe(
        addDays(mockCoffee.roastDate, 26).getTime()
      );
    });

    it('should schedule last_chance reminder for day 30', () => {
      const reminders = scheduler.scheduleReminders(mockCoffee, mockPreferences);
      const lastChanceReminder = reminders.find(
        (r) => r.type === 'last_chance'
      );

      expect(lastChanceReminder).toBeDefined();
      expect(lastChanceReminder?.scheduledDate.getTime()).toBe(
        addDays(mockCoffee.roastDate, 30).getTime()
      );
    });

    it('should not schedule disabled reminders', () => {
      const preferences: NotificationPreferences = {
        email: true,
        push: false,
        peakFreshnessReminder: true,
        consumeSoonReminder: false,
        lastChanceReminder: false,
      };

      const reminders = scheduler.scheduleReminders(mockCoffee, preferences);

      expect(reminders).toHaveLength(1);
      expect(reminders[0].type).toBe('peak_freshness');
    });

    it('should mark all reminders as not sent initially', () => {
      const reminders = scheduler.scheduleReminders(mockCoffee, mockPreferences);

      expect(reminders.every((r) => r.sent === false)).toBe(true);
    });
  });

  describe('getReminders', () => {
    it('should return scheduled reminders for a coffee', () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);
      const reminders = scheduler.getReminders(mockCoffee.id);

      expect(reminders).toHaveLength(3);
    });

    it('should return empty array for unknown coffee', () => {
      const reminders = scheduler.getReminders('unknown');

      expect(reminders).toHaveLength(0);
    });
  });

  describe('getAllPendingReminders', () => {
    it('should return all pending reminders', () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);
      const pending = scheduler.getAllPendingReminders();

      expect(pending).toHaveLength(3);
    });

    it('should not include sent reminders', () => {
      const reminders = scheduler.scheduleReminders(
        mockCoffee,
        mockPreferences
      );
      reminders[0].sent = true;

      const pending = scheduler.getAllPendingReminders();

      expect(pending).toHaveLength(2);
    });
  });

  describe('cancelReminders', () => {
    it('should remove all reminders for a coffee', () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);
      scheduler.cancelReminders(mockCoffee.id);

      const reminders = scheduler.getReminders(mockCoffee.id);
      expect(reminders).toHaveLength(0);
    });
  });

  describe('clearAllReminders', () => {
    it('should remove all reminders', () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);
      scheduler.clearAllReminders();

      const stats = scheduler.getStats();
      expect(stats.totalReminders).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const reminders = scheduler.scheduleReminders(
        mockCoffee,
        mockPreferences
      );
      reminders[0].sent = true;

      const stats = scheduler.getStats();

      expect(stats.totalReminders).toBe(3);
      expect(stats.sentReminders).toBe(1);
      expect(stats.pendingReminders).toBe(2);
    });

    it('should return zeros when no reminders scheduled', () => {
      const stats = scheduler.getStats();

      expect(stats.totalReminders).toBe(0);
      expect(stats.sentReminders).toBe(0);
      expect(stats.pendingReminders).toBe(0);
    });
  });

  describe('checkAndSendReminders', () => {
    it('should send due reminders', async () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);

      const coffees = new Map([[mockCoffee.id, mockCoffee]]);
      const preferences = new Map([[mockCoffee.id, mockPreferences]]);
      const emails = new Map([[mockCoffee.id, 'test@example.com']]);
      const tokens = new Map([[mockCoffee.id, 'test-token']]);

      const currentDate = addDays(mockCoffee.roastDate, 4);

      const sent = await scheduler.checkAndSendReminders(
        coffees,
        preferences,
        emails,
        tokens,
        currentDate
      );

      expect(sent).toHaveLength(1);
      expect(sent[0].type).toBe('peak_freshness');
      expect(sent[0].sent).toBe(true);
    });

    it('should not send reminders on wrong date', async () => {
      scheduler.scheduleReminders(mockCoffee, mockPreferences);

      const coffees = new Map([[mockCoffee.id, mockCoffee]]);
      const preferences = new Map([[mockCoffee.id, mockPreferences]]);
      const emails = new Map([[mockCoffee.id, 'test@example.com']]);
      const tokens = new Map([[mockCoffee.id, 'test-token']]);

      const currentDate = addDays(mockCoffee.roastDate, 5);

      const sent = await scheduler.checkAndSendReminders(
        coffees,
        preferences,
        emails,
        tokens,
        currentDate
      );

      expect(sent).toHaveLength(0);
    });

    it('should not send already sent reminders', async () => {
      const reminders = scheduler.scheduleReminders(
        mockCoffee,
        mockPreferences
      );
      reminders[0].sent = true;

      const coffees = new Map([[mockCoffee.id, mockCoffee]]);
      const preferences = new Map([[mockCoffee.id, mockPreferences]]);
      const emails = new Map([[mockCoffee.id, 'test@example.com']]);
      const tokens = new Map([[mockCoffee.id, 'test-token']]);

      const currentDate = addDays(mockCoffee.roastDate, 4);

      const sent = await scheduler.checkAndSendReminders(
        coffees,
        preferences,
        emails,
        tokens,
        currentDate
      );

      expect(sent).toHaveLength(0);
    });
  });
});
