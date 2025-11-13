import { addDays, subDays } from 'date-fns';
import {
  calculateFreshness,
  shouldSendReminder,
  generateReminderMessage,
  BREWING_METHODS,
} from '../freshnessCalculator';
import { Coffee, FreshnessStatus } from '../../types/coffee';

describe('Freshness Calculator', () => {
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

  describe('calculateFreshness', () => {
    it('should return TOO_FRESH status for coffee roasted 1 day ago', () => {
      const currentDate = addDays(mockCoffee.roastDate, 1);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.status).toBe(FreshnessStatus.TOO_FRESH);
      expect(result.daysFromRoast).toBe(1);
      expect(result.statusLabel).toBe('Degassing');
      expect(result.daysUntilPeak).toBeDefined();
    });

    it('should return PEAK status for coffee roasted 7 days ago', () => {
      const currentDate = addDays(mockCoffee.roastDate, 7);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.status).toBe(FreshnessStatus.PEAK);
      expect(result.daysFromRoast).toBe(7);
      expect(result.statusLabel).toBe('Peak Freshness');
      expect(result.daysUntilPeak).toBeUndefined();
    });

    it('should return GOOD status for coffee roasted 18 days ago', () => {
      const currentDate = addDays(mockCoffee.roastDate, 18);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.status).toBe(FreshnessStatus.GOOD);
      expect(result.daysFromRoast).toBe(18);
      expect(result.statusLabel).toBe('Good');
    });

    it('should return FADING status for coffee roasted 25 days ago', () => {
      const currentDate = addDays(mockCoffee.roastDate, 25);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.status).toBe(FreshnessStatus.FADING);
      expect(result.daysFromRoast).toBe(25);
      expect(result.statusLabel).toBe('Fading');
    });

    it('should return STALE status for coffee roasted 35 days ago', () => {
      const currentDate = addDays(mockCoffee.roastDate, 35);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.status).toBe(FreshnessStatus.STALE);
      expect(result.daysFromRoast).toBe(35);
      expect(result.statusLabel).toBe('Past Prime');
    });

    it('should include consume by date 30 days from roast', () => {
      const currentDate = addDays(mockCoffee.roastDate, 7);
      const result = calculateFreshness(mockCoffee, currentDate);

      const expectedConsumeByDate = addDays(mockCoffee.roastDate, 30);
      expect(result.consumeByDate.getTime()).toBe(
        expectedConsumeByDate.getTime()
      );
    });

    it('should suggest espresso for coffee at day 10', () => {
      const currentDate = addDays(mockCoffee.roastDate, 10);
      const result = calculateFreshness(mockCoffee, currentDate);

      const hasEspresso = result.optimalBrewingMethods.some(
        (m) => m.name === 'Espresso'
      );
      expect(hasEspresso).toBe(true);
    });

    it('should not suggest espresso for coffee at day 2', () => {
      const currentDate = addDays(mockCoffee.roastDate, 2);
      const result = calculateFreshness(mockCoffee, currentDate);

      const hasEspresso = result.optimalBrewingMethods.some(
        (m) => m.name === 'Espresso'
      );
      expect(hasEspresso).toBe(false);
    });

    it('should have fewer optimal brewing methods for very fresh coffee', () => {
      const currentDate = addDays(mockCoffee.roastDate, 3);
      const result = calculateFreshness(mockCoffee, currentDate);

      expect(result.optimalBrewingMethods.length).toBeLessThan(
        BREWING_METHODS.length
      );
    });
  });

  describe('shouldSendReminder', () => {
    it('should send peak_freshness reminder on day 4', () => {
      const currentDate = addDays(mockCoffee.roastDate, 4);
      const result = shouldSendReminder(
        mockCoffee,
        'peak_freshness',
        currentDate
      );

      expect(result).toBe(true);
    });

    it('should not send peak_freshness reminder on day 5', () => {
      const currentDate = addDays(mockCoffee.roastDate, 5);
      const result = shouldSendReminder(
        mockCoffee,
        'peak_freshness',
        currentDate
      );

      expect(result).toBe(false);
    });

    it('should send consume_soon reminder on day 26', () => {
      const currentDate = addDays(mockCoffee.roastDate, 26);
      const result = shouldSendReminder(
        mockCoffee,
        'consume_soon',
        currentDate
      );

      expect(result).toBe(true);
    });

    it('should send last_chance reminder on day 30', () => {
      const currentDate = addDays(mockCoffee.roastDate, 30);
      const result = shouldSendReminder(
        mockCoffee,
        'last_chance',
        currentDate
      );

      expect(result).toBe(true);
    });

    it('should not send last_chance reminder on day 29', () => {
      const currentDate = addDays(mockCoffee.roastDate, 29);
      const result = shouldSendReminder(
        mockCoffee,
        'last_chance',
        currentDate
      );

      expect(result).toBe(false);
    });
  });

  describe('generateReminderMessage', () => {
    it('should generate peak_freshness message', () => {
      const message = generateReminderMessage(mockCoffee, 'peak_freshness');

      expect(message).toContain('peak freshness');
      expect(message).toContain(mockCoffee.name);
      expect(message).toContain(mockCoffee.roaster);
    });

    it('should generate consume_soon message', () => {
      const message = generateReminderMessage(mockCoffee, 'consume_soon');

      expect(message).toContain('consumed soon');
      expect(message).toContain(mockCoffee.name);
      expect(message).toContain(mockCoffee.roaster);
    });

    it('should generate last_chance message', () => {
      const message = generateReminderMessage(mockCoffee, 'last_chance');

      expect(message).toContain('Last chance');
      expect(message).toContain(mockCoffee.name);
      expect(message).toContain(mockCoffee.roaster);
    });
  });

  describe('BREWING_METHODS', () => {
    it('should have espresso with 7-21 day window', () => {
      const espresso = BREWING_METHODS.find((m) => m.name === 'Espresso');

      expect(espresso).toBeDefined();
      expect(espresso?.optimalDaysMin).toBe(7);
      expect(espresso?.optimalDaysMax).toBe(21);
    });

    it('should have pour over with earlier window than espresso', () => {
      const pourOver = BREWING_METHODS.find((m) => m.name === 'Pour Over');
      const espresso = BREWING_METHODS.find((m) => m.name === 'Espresso');

      expect(pourOver?.optimalDaysMin).toBeLessThan(
        espresso?.optimalDaysMin || 0
      );
    });

    it('should include cold brew with longest window', () => {
      const coldBrew = BREWING_METHODS.find((m) => m.name === 'Cold Brew');

      expect(coldBrew).toBeDefined();
      expect(coldBrew?.optimalDaysMax).toBeGreaterThanOrEqual(21);
    });
  });
});
