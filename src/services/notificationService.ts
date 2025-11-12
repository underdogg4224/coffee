import {
  Coffee,
  FreshnessReminder,
  NotificationPreferences,
} from '../types/coffee';
import {
  shouldSendReminder,
  generateReminderMessage,
} from '../utils/freshnessCalculator';

/**
 * Notification service for sending freshness reminders
 */
export class NotificationService {
  private emailProvider?: EmailProvider;
  private pushProvider?: PushProvider;

  constructor(emailProvider?: EmailProvider, pushProvider?: PushProvider) {
    this.emailProvider = emailProvider;
    this.pushProvider = pushProvider;
  }

  /**
   * Send a freshness reminder notification
   */
  async sendReminder(
    coffee: Coffee,
    reminder: FreshnessReminder,
    preferences: NotificationPreferences,
    userEmail?: string,
    pushToken?: string
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    // Send email notification if enabled
    if (preferences.email && userEmail && this.emailProvider) {
      promises.push(
        this.sendEmailNotification(coffee, reminder, userEmail)
      );
    }

    // Send push notification if enabled
    if (preferences.push && pushToken && this.pushProvider) {
      promises.push(
        this.sendPushNotification(coffee, reminder, pushToken)
      );
    }

    await Promise.all(promises);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    coffee: Coffee,
    reminder: FreshnessReminder,
    email: string
  ): Promise<void> {
    if (!this.emailProvider) {
      throw new Error('Email provider not configured');
    }

    const subject = this.getEmailSubject(reminder.type);
    const body = this.getEmailBody(coffee, reminder);

    await this.emailProvider.send({
      to: email,
      subject,
      body,
    });
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(
    coffee: Coffee,
    reminder: FreshnessReminder,
    token: string
  ): Promise<void> {
    if (!this.pushProvider) {
      throw new Error('Push provider not configured');
    }

    await this.pushProvider.send({
      token,
      title: this.getPushTitle(reminder.type),
      body: reminder.message,
      data: {
        coffeeId: coffee.id,
        reminderType: reminder.type,
      },
    });
  }

  /**
   * Get email subject based on reminder type
   */
  private getEmailSubject(
    type: 'peak_freshness' | 'consume_soon' | 'last_chance'
  ): string {
    const subjects = {
      peak_freshness: '☕ Your Coffee Has Reached Peak Freshness!',
      consume_soon: '⏰ Coffee Freshness Alert - Consume Soon',
      last_chance: '🚨 Last Chance - Coffee Expires Tomorrow',
    };
    return subjects[type];
  }

  /**
   * Get push notification title
   */
  private getPushTitle(
    type: 'peak_freshness' | 'consume_soon' | 'last_chance'
  ): string {
    const titles = {
      peak_freshness: 'Peak Freshness Reached!',
      consume_soon: 'Consume Soon',
      last_chance: 'Last Chance!',
    };
    return titles[type];
  }

  /**
   * Generate HTML email body
   */
  private getEmailBody(coffee: Coffee, reminder: FreshnessReminder): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .coffee-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .label {
            font-weight: 600;
            color: #666;
          }
          .cta-button {
            display: inline-block;
            background: #00c853;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Coffee Freshness Alert</h1>
        </div>
        <div class="content">
          <p>${reminder.message}</p>

          <div class="coffee-details">
            <div class="detail-row">
              <span class="label">Coffee:</span>
              <span>${coffee.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Roaster:</span>
              <span>${coffee.roaster}</span>
            </div>
            <div class="detail-row">
              <span class="label">Origin:</span>
              <span>${coffee.origin}</span>
            </div>
            <div class="detail-row">
              <span class="label">Roast Level:</span>
              <span>${coffee.roastLevel}</span>
            </div>
          </div>

          <p>Visit your dashboard to see brewing recommendations and optimal methods for this coffee.</p>

          <a href="#" class="cta-button">View Brewing Guide</a>
        </div>
      </body>
      </html>
    `;
  }
}

/**
 * Email provider interface
 */
export interface EmailProvider {
  send(params: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void>;
}

/**
 * Push notification provider interface
 */
export interface PushProvider {
  send(params: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<void>;
}

/**
 * Example email provider implementation (using console for demo)
 */
export class ConsoleEmailProvider implements EmailProvider {
  async send(params: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    console.log('=== EMAIL NOTIFICATION ===');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Body: ${params.body.substring(0, 200)}...`);
    console.log('========================');
  }
}

/**
 * Example push provider implementation (using console for demo)
 */
export class ConsolePushProvider implements PushProvider {
  async send(params: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<void> {
    console.log('=== PUSH NOTIFICATION ===');
    console.log(`Token: ${params.token}`);
    console.log(`Title: ${params.title}`);
    console.log(`Body: ${params.body}`);
    console.log(`Data:`, params.data);
    console.log('========================');
  }
}
