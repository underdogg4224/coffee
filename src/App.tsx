import React, { useState, useEffect } from 'react';
import { Coffee, NotificationPreferences } from './types/coffee';
import { CoffeeCard } from './components/CoffeeCard';
import {
  NotificationService,
  ConsoleEmailProvider,
  ConsolePushProvider,
} from './services/notificationService';
import { ReminderScheduler } from './services/reminderScheduler';
import './components/styles.css';

/**
 * Example Coffee Freshness Tracker Application
 */
function App() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [scheduler] = useState(() => {
    const notificationService = new NotificationService(
      new ConsoleEmailProvider(),
      new ConsolePushProvider()
    );
    return new ReminderScheduler(notificationService);
  });

  // Initialize with example coffees
  useEffect(() => {
    const exampleCoffees: Coffee[] = [
      {
        id: '1',
        name: 'Ethiopian Yirgacheffe',
        roaster: 'Counter Culture Coffee',
        roastDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        origin: 'Ethiopia',
        roastLevel: 'light',
        flavorProfile: ['Blueberry', 'Floral', 'Citrus'],
        weight: 340,
      },
      {
        id: '2',
        name: 'Colombian Supremo',
        roaster: 'Intelligentsia Coffee',
        roastDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        origin: 'Colombia',
        roastLevel: 'medium',
        flavorProfile: ['Chocolate', 'Caramel', 'Nutty'],
        weight: 454,
      },
      {
        id: '3',
        name: 'Sumatra Mandheling',
        roaster: 'Stumptown Coffee Roasters',
        roastDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
        origin: 'Indonesia',
        roastLevel: 'dark',
        flavorProfile: ['Earthy', 'Herbal', 'Spicy'],
        weight: 340,
      },
      {
        id: '4',
        name: 'Kenya AA',
        roaster: 'Verve Coffee Roasters',
        roastDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        origin: 'Kenya',
        roastLevel: 'medium',
        flavorProfile: ['Blackcurrant', 'Winey', 'Bright'],
        weight: 340,
      },
    ];

    setCoffees(exampleCoffees);

    // Schedule reminders for each coffee
    const preferences: NotificationPreferences = {
      email: true,
      push: true,
      peakFreshnessReminder: true,
      consumeSoonReminder: true,
      lastChanceReminder: true,
    };

    exampleCoffees.forEach((coffee) => {
      scheduler.scheduleReminders(coffee, preferences);
    });

    // Log reminder statistics
    const stats = scheduler.getStats();
    console.log('Reminder Statistics:', stats);
  }, [scheduler]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Coffee Freshness Tracker</h1>
        <p className="app-subtitle">
          Track your coffee's freshness and get optimal brewing recommendations
        </p>
      </header>

      <main className="app-main">
        <div className="coffee-grid">
          {coffees.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} showTimeline={true} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Coffee Freshness Tracker - Helping you brew the perfect cup at the
          perfect time
        </p>
      </footer>
    </div>
  );
}

export default App;
