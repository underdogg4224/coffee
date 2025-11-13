# Coffee Freshness Tracker & Brewing Timeline

A comprehensive tool for tracking coffee freshness and providing optimal brewing recommendations based on roast date. This feature helps customers understand exactly when their coffee was roasted and guides them to brew at peak freshness.

## Features

### 1. **Real-Time Freshness Tracking**
- Tracks days from roast date
- Displays current freshness status (Degassing, Peak, Good, Fading, Stale)
- Shows consume-by date (30 days post-roast)
- Visual color-coded status indicators

### 2. **Brewing Timeline & Recommendations**
Provides optimal brewing windows for different methods:
- **Espresso**: Days 7-21 (requires degassing period)
- **Pour Over**: Days 4-14 (ideal for filter methods)
- **French Press**: Days 5-14 (immersion brewing)
- **Cold Brew**: Days 3-21 (versatile freshness range)
- **Aeropress**: Days 4-18 (multi-purpose brewing)
- **Drip Coffee**: Days 5-21 (standard automatic machines)

### 3. **Smart Notifications & Reminders**
Automated reminders via email and push notifications:
- **Peak Freshness Alert** (Day 4): Notifies when coffee reaches optimal freshness
- **Consume Soon Reminder** (Day 26): 5-day warning before flavor degradation
- **Last Chance Alert** (Day 30): Final reminder to brew before going stale

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Usage

### Basic Component Usage

```typescript
import { CoffeeCard } from './components/CoffeeCard';
import { Coffee } from './types/coffee';

const coffee: Coffee = {
  id: '1',
  name: 'Ethiopian Yirgacheffe',
  roaster: 'Counter Culture Coffee',
  roastDate: new Date('2025-11-01'),
  origin: 'Ethiopia',
  roastLevel: 'light',
  flavorProfile: ['Blueberry', 'Floral', 'Citrus'],
  weight: 340,
};

function App() {
  return <CoffeeCard coffee={coffee} showTimeline={true} />;
}
```

### Freshness Calculation

```typescript
import { calculateFreshness } from './utils/freshnessCalculator';

const freshnessInfo = calculateFreshness(coffee);

console.log(freshnessInfo.status); // 'peak', 'good', 'fading', etc.
console.log(freshnessInfo.daysFromRoast); // Number of days since roast
console.log(freshnessInfo.optimalBrewingMethods); // Recommended brewing methods
console.log(freshnessInfo.message); // Human-readable freshness message
```

### Setting Up Notifications

```typescript
import { NotificationService } from './services/notificationService';
import { ReminderScheduler } from './services/reminderScheduler';

// Initialize notification service
const notificationService = new NotificationService(
  emailProvider, // Implement EmailProvider interface
  pushProvider   // Implement PushProvider interface
);

// Create reminder scheduler
const scheduler = new ReminderScheduler(notificationService);

// Schedule reminders for a coffee
const preferences = {
  email: true,
  push: true,
  peakFreshnessReminder: true,
  consumeSoonReminder: true,
  lastChanceReminder: true,
};

scheduler.scheduleReminders(coffee, preferences);
```

### Custom Email/Push Providers

Implement your own notification providers:

```typescript
import { EmailProvider, PushProvider } from './services/notificationService';

// Example: SendGrid Email Provider
class SendGridEmailProvider implements EmailProvider {
  async send(params: { to: string; subject: string; body: string }) {
    // Implement SendGrid integration
    await sendgridClient.send({
      to: params.to,
      from: 'noreply@coffee-shop.com',
      subject: params.subject,
      html: params.body,
    });
  }
}

// Example: Firebase Cloud Messaging Provider
class FCMPushProvider implements PushProvider {
  async send(params: { token: string; title: string; body: string }) {
    // Implement FCM integration
    await admin.messaging().send({
      token: params.token,
      notification: {
        title: params.title,
        body: params.body,
      },
    });
  }
}
```

## API Reference

### Types

#### `Coffee`
```typescript
interface Coffee {
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
```

#### `FreshnessInfo`
```typescript
interface FreshnessInfo {
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
```

#### `NotificationPreferences`
```typescript
interface NotificationPreferences {
  email: boolean;
  push: boolean;
  peakFreshnessReminder: boolean;
  consumeSoonReminder: boolean;
  lastChanceReminder: boolean;
}
```

### Functions

#### `calculateFreshness(coffee: Coffee, currentDate?: Date): FreshnessInfo`
Calculates comprehensive freshness information for a coffee product.

#### `shouldSendReminder(coffee: Coffee, reminderType: string, currentDate?: Date): boolean`
Checks if a reminder should be sent based on the coffee's age.

#### `generateReminderMessage(coffee: Coffee, reminderType: string): string`
Generates a personalized reminder message.

## Components

### `<CoffeeCard>`
Complete coffee product card with freshness tracking.

**Props:**
- `coffee: Coffee` - Coffee product data
- `showTimeline?: boolean` - Show brewing timeline (default: true)
- `className?: string` - Additional CSS classes

### `<FreshnessIndicator>`
Visual indicator showing current freshness status.

**Props:**
- `freshnessInfo: FreshnessInfo` - Freshness data
- `className?: string` - Additional CSS classes

### `<BrewingTimeline>`
Timeline showing optimal brewing windows for different methods.

**Props:**
- `freshnessInfo: FreshnessInfo` - Freshness data
- `className?: string` - Additional CSS classes

## Freshness Timeline

| Days from Roast | Status | Description |
|----------------|--------|-------------|
| 0-3 | Degassing | Too fresh, CO2 still releasing |
| 4-14 | Peak | Optimal flavor and aroma |
| 15-21 | Good | Still fresh and delicious |
| 22-30 | Fading | Freshness declining, consume soon |
| 31+ | Stale | Past optimal freshness |

## Testing

The project includes comprehensive tests for:
- Freshness calculation algorithms
- Reminder scheduling logic
- Notification service functionality

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Integration Examples

### E-commerce Integration

```typescript
// Add to product page
import { CoffeeCard } from './components/CoffeeCard';

function ProductPage({ product }) {
  const coffee: Coffee = {
    id: product.id,
    name: product.name,
    roaster: product.roaster,
    roastDate: new Date(product.roastDate),
    origin: product.origin,
    roastLevel: product.roastLevel,
    flavorProfile: product.flavorNotes,
    weight: product.weight,
  };

  return (
    <div>
      <CoffeeCard coffee={coffee} />
    </div>
  );
}
```

### Order Confirmation Email

```typescript
// Include freshness info in order confirmation
import { calculateFreshness } from './utils/freshnessCalculator';

function sendOrderConfirmation(order) {
  const freshnessInfo = calculateFreshness(order.coffee);

  const emailBody = `
    Your ${order.coffee.name} was roasted on ${order.coffee.roastDate}.

    ${freshnessInfo.message}

    Recommended brewing methods:
    ${freshnessInfo.optimalBrewingMethods.map(m => `- ${m.name}`).join('\n')}
  `;

  // Send email...
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For questions or issues, please open an issue on GitHub or contact support@coffee-shop.com.
