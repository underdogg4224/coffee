# Gift Builder & Registry System

A comprehensive coffee gifting solution that allows customers to create personalized coffee gift boxes and manage gift registries for special occasions.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Business Logic](#business-logic)

## ✨ Features

### Gift Builder
- **Custom Gift Boxes**: Create personalized coffee gift boxes with custom product selections
- **Personalized Messages**: Add heartfelt messages to gifts
- **Scheduled Deliveries**: Schedule gift deliveries for specific dates
- **Delivery Preferences**: Choose delivery time preferences (morning, afternoon, evening, anytime)
- **Premium Packaging**: Select from standard, premium, or luxury packaging options
- **Greeting Cards**: Include customizable greeting cards
- **Surprise Mode**: Hide order details from recipients
- **Multiple Occasions**: Support for birthdays, weddings, holidays, corporate gifts, etc.

### Gift Registry
- **Registry Types**: Wedding, holiday, corporate, birthday, anniversary, and custom registries
- **Curated Selections**: Pre-select coffee products for recipients to choose from
- **Custom Items**: Allow custom gift amounts alongside product selections
- **Partial Fulfillment**: Enable partial quantity purchases for registry items
- **Priority System**: Mark items as high, medium, or low priority
- **Public/Private**: Control registry visibility
- **Progress Tracking**: Monitor fulfillment progress with target amounts
- **Purchase Management**: Track all purchases and contributors
- **Anonymous Gifting**: Allow anonymous contributions
- **Thank You Messages**: Customize messages for gift givers

## 🏗️ Architecture

### Technology Stack
- **Framework**: Laravel (PHP)
- **Database**: MySQL/PostgreSQL (via Laravel migrations)
- **ORM**: Eloquent
- **Architecture**: RESTful API

### Key Components

```
coffee/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── GiftBuilderController.php
│   │       └── GiftRegistryController.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Gift.php
│       ├── GiftItem.php
│       ├── GiftRegistry.php
│       ├── GiftRegistryItem.php
│       └── GiftRegistryPurchase.php
├── database/
│   └── migrations/
│       ├── 2025_01_01_000000_create_users_table.php
│       ├── 2025_01_01_000001_create_products_table.php
│       ├── 2025_01_01_000002_create_gifts_table.php
│       ├── 2025_01_01_000003_create_gift_items_table.php
│       ├── 2025_01_01_000004_create_gift_registries_table.php
│       ├── 2025_01_01_000005_create_gift_registry_items_table.php
│       └── 2025_01_01_000006_create_gift_registry_purchases_table.php
└── routes/
    └── api.php
```

## 🗄️ Database Schema

### Core Tables

#### 1. **users**
- Manages user accounts for gift creators and purchasers

#### 2. **products**
- Coffee products and accessories available for gifting
- Fields: name, description, type, roast_level, origin, price, stock_quantity, flavor_notes
- `available_for_gifting` flag enables/disables products for gifts

#### 3. **gifts**
- Gift box configurations with delivery details
- Fields: recipient info, personalized message, occasion, delivery schedule
- Status workflow: draft → pending → paid → processing → shipped → delivered
- Unique `gift_code` for tracking (e.g., GIFT-ABC123XYZ)

#### 4. **gift_items**
- Individual products within a gift box
- Quantity, pricing, and custom notes per item
- Auto-calculates subtotal on save

#### 5. **gift_registries**
- Gift registry configurations for events
- Fields: event details, contact info, shipping address, privacy settings
- Unique `registry_code` for public access (e.g., REG-ABC123XYZ)
- Status workflow: draft → active → completed → cancelled
- Target amount tracking with received amount calculations

#### 6. **gift_registry_items**
- Curated items within a registry
- Quantity tracking: requested vs purchased
- Priority levels: 1 (high), 2 (medium), 3 (low)
- Partial fulfillment support

#### 7. **gift_registry_purchases**
- Tracks purchases made toward registry items
- Purchaser info (can be anonymous)
- Status: pending → completed → refunded → cancelled
- Links to specific registry items or general contributions

### Entity Relationships

```
User
├── hasMany: gifts
├── hasMany: registries
└── hasMany: registryPurchases

Product
├── hasMany: giftItems
└── hasMany: registryItems

Gift
├── belongsTo: user
└── hasMany: items (GiftItem)

GiftItem
├── belongsTo: gift
└── belongsTo: product

GiftRegistry
├── belongsTo: user
├── hasMany: items (GiftRegistryItem)
└── hasMany: purchases (GiftRegistryPurchase)

GiftRegistryItem
├── belongsTo: registry
├── belongsTo: product
└── hasMany: purchases

GiftRegistryPurchase
├── belongsTo: registry
├── belongsTo: registryItem
└── belongsTo: purchaser (User)
```

## 📚 API Documentation

### Base URL
```
/api
```

### Authentication
Most endpoints support optional authentication. User ID defaults to 1 if not authenticated.

---

## Gift Builder Endpoints

### 1. Get Available Products for Gifting

**Endpoint**: `GET /api/gifts/products`

**Query Parameters**:
- `type` (optional): Filter by product type
- `roast_level` (optional): Filter by roast level (light, medium, dark)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ethiopian Yirgacheffe",
      "description": "Bright and floral with notes of citrus",
      "type": "coffee",
      "roast_level": "light",
      "origin": "Ethiopia",
      "price": "18.99",
      "size": "250g",
      "stock_quantity": 50,
      "available_for_gifting": true,
      "flavor_notes": ["citrus", "floral", "bright"]
    }
  ]
}
```

---

### 2. Create Gift

**Endpoint**: `POST /api/gifts`

**Request Body**:
```json
{
  "recipient_name": "John Doe",
  "recipient_email": "john@example.com",
  "recipient_phone": "+1234567890",
  "personalized_message": "Happy Birthday! Enjoy these amazing coffees!",
  "occasion": "birthday",
  "scheduled_delivery_date": "2025-02-15",
  "delivery_time_preference": "morning",
  "shipping_address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "country": "USA"
  },
  "packaging_type": "premium",
  "include_greeting_card": true,
  "greeting_card_design": "birthday-balloons",
  "is_surprise": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Gift created successfully",
  "data": {
    "id": 1,
    "gift_code": "GIFT-A1B2C3D4E5",
    "recipient_name": "John Doe",
    "status": "draft",
    "total_amount": "0.00"
  }
}
```

---

### 3. Add Items to Gift

**Endpoint**: `POST /api/gifts/{giftId}/items`

**Request Body**:
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "custom_notes": "Please grind for espresso"
    },
    {
      "product_id": 3,
      "quantity": 1,
      "custom_notes": "Whole beans"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Items added to gift successfully",
  "data": {
    "id": 1,
    "gift_code": "GIFT-A1B2C3D4E5",
    "total_amount": "56.97",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "unit_price": "18.99",
        "subtotal": "37.98",
        "product": {
          "id": 1,
          "name": "Ethiopian Yirgacheffe"
        }
      }
    ]
  }
}
```

---

### 4. Update Gift Item

**Endpoint**: `PUT /api/gifts/{giftId}/items/{itemId}`

**Request Body**:
```json
{
  "quantity": 3
}
```

---

### 5. Remove Gift Item

**Endpoint**: `DELETE /api/gifts/{giftId}/items/{itemId}`

---

### 6. Get Gift Details

**Endpoint**: `GET /api/gifts/{giftId}`

---

### 7. Get Gift by Code

**Endpoint**: `GET /api/gifts/code/{code}`

Example: `GET /api/gifts/code/GIFT-A1B2C3D4E5`

---

### 8. Update Gift

**Endpoint**: `PUT /api/gifts/{giftId}`

**Request Body**: Same fields as create, all optional

---

### 9. Checkout Gift

**Endpoint**: `POST /api/gifts/{giftId}/checkout`

Validates stock and reserves products, transitions gift to 'pending' status.

**Response**:
```json
{
  "success": true,
  "message": "Gift checkout initiated",
  "data": {
    "gift": { ... },
    "payment_required": "56.97"
  }
}
```

---

### 10. Confirm Payment

**Endpoint**: `POST /api/gifts/{giftId}/confirm-payment`

**Request Body**:
```json
{
  "transaction_id": "txn_abc123xyz"
}
```

---

### 11. Get User's Gifts

**Endpoint**: `GET /api/gifts/user`

Returns all gifts created by authenticated user.

---

### 12. Delete Gift

**Endpoint**: `DELETE /api/gifts/{giftId}`

Only allows deletion of draft/pending gifts.

---

## Gift Registry Endpoints

### 1. Create Registry

**Endpoint**: `POST /api/registries`

**Request Body**:
```json
{
  "title": "Sarah & Michael's Wedding Registry",
  "description": "Help us celebrate our special day with amazing coffee!",
  "type": "wedding",
  "event_name": "Sarah & Michael's Wedding",
  "event_date": "2025-06-15",
  "registry_owner_name": "Sarah Johnson",
  "co_owner_name": "Michael Smith",
  "contact_email": "sarah@example.com",
  "contact_phone": "+1234567890",
  "shipping_address": {
    "street": "456 Oak Ave",
    "city": "Seattle",
    "state": "WA",
    "zip": "98101",
    "country": "USA"
  },
  "is_public": true,
  "allow_custom_amounts": true,
  "show_purchased_items": false,
  "target_amount": 500.00,
  "thank_you_message": "Thank you for your generous gift!",
  "registry_start_date": "2025-01-01",
  "registry_end_date": "2025-07-01"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registry created successfully",
  "data": {
    "id": 1,
    "registry_code": "REG-X9Y8Z7W6V5",
    "title": "Sarah & Michael's Wedding Registry",
    "status": "draft",
    "received_amount": "0.00"
  }
}
```

---

### 2. Add Curated Items to Registry

**Endpoint**: `POST /api/registries/{registryId}/items`

**Request Body**:
```json
{
  "items": [
    {
      "product_id": 1,
      "item_name": "Ethiopian Yirgacheffe",
      "item_description": "Our favorite morning coffee",
      "item_price": 18.99,
      "quantity_requested": 5,
      "priority": 1,
      "allow_partial": true,
      "notes": "Prefer whole beans"
    },
    {
      "product_id": null,
      "item_name": "Coffee Subscription",
      "item_description": "3-month subscription",
      "item_price": 75.00,
      "quantity_requested": 1,
      "priority": 1,
      "allow_partial": false
    }
  ]
}
```

---

### 3. Get Registry by Code (Public)

**Endpoint**: `GET /api/registries/code/{code}`

Example: `GET /api/registries/code/REG-X9Y8Z7W6V5`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "registry_code": "REG-X9Y8Z7W6V5",
    "title": "Sarah & Michael's Wedding Registry",
    "description": "Help us celebrate our special day with amazing coffee!",
    "type": "wedding",
    "event_name": "Sarah & Michael's Wedding",
    "event_date": "2025-06-15",
    "registry_owner_name": "Sarah Johnson",
    "co_owner_name": "Michael Smith",
    "is_public": true,
    "target_amount": "500.00",
    "received_amount": "125.00",
    "completion_percentage": 25.00,
    "items": [
      {
        "id": 1,
        "item_name": "Ethiopian Yirgacheffe",
        "item_price": "18.99",
        "quantity_requested": 5,
        "quantity_purchased": 2,
        "remaining_quantity": 3,
        "fulfillment_percentage": 40.00,
        "priority": 1,
        "product": { ... }
      }
    ]
  }
}
```

---

### 4. Get Registry Details (Owner)

**Endpoint**: `GET /api/registries/{registryId}`

Returns full details including purchases and purchaser information.

---

### 5. Update Registry

**Endpoint**: `PUT /api/registries/{registryId}`

**Request Body**: Same fields as create, all optional

---

### 6. Activate Registry

**Endpoint**: `POST /api/registries/{registryId}/activate`

Transitions registry from 'draft' to 'active' status.

---

### 7. Purchase from Registry

**Endpoint**: `POST /api/registries/{registryId}/purchase`

**Request Body**:
```json
{
  "registry_item_id": 1,
  "purchaser_name": "Jane Smith",
  "purchaser_email": "jane@example.com",
  "quantity": 2,
  "amount": 37.98,
  "message_to_recipient": "Congratulations on your wedding!",
  "is_anonymous": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Purchase initiated successfully",
  "data": {
    "id": 1,
    "gift_registry_id": 1,
    "purchaser_name": "Jane Smith",
    "quantity": 2,
    "amount": "37.98",
    "status": "pending"
  }
}
```

---

### 8. Confirm Registry Purchase

**Endpoint**: `POST /api/registries/purchases/{purchaseId}/confirm`

**Request Body**:
```json
{
  "transaction_id": "txn_reg_abc123"
}
```

Marks purchase as completed and updates registry item quantities and received amount.

---

### 9. Get User's Registries

**Endpoint**: `GET /api/registries/user`

---

### 10. Search Public Registries

**Endpoint**: `GET /api/registries/search`

**Query Parameters**:
- `type` (optional): Filter by registry type
- `search` (optional): Search in title, event name, or owner name

---

### 11. Update Registry Item

**Endpoint**: `PUT /api/registries/{registryId}/items/{itemId}`

**Request Body**:
```json
{
  "quantity_requested": 10,
  "priority": 2,
  "item_name": "Updated Name",
  "item_price": 19.99
}
```

---

### 12. Delete Registry Item

**Endpoint**: `DELETE /api/registries/{registryId}/items/{itemId}`

Cannot delete items with purchases.

---

### 13. Delete Registry

**Endpoint**: `DELETE /api/registries/{registryId}`

Cannot delete registries with completed purchases.

---

## 🚀 Installation

### Prerequisites
- PHP 8.1+
- Composer
- MySQL 8.0+ or PostgreSQL 12+
- Laravel 11.x

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd coffee
```

2. **Install dependencies**
```bash
composer install
```

3. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database in .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coffee_db
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations**
```bash
php artisan migrate
```

6. **Seed sample data (optional)**
```bash
php artisan db:seed
```

7. **Start development server**
```bash
php artisan serve
```

API will be available at: `http://localhost:8000/api`

---

## 💡 Usage Examples

### Example 1: Create a Birthday Gift

```bash
# Step 1: Create gift
curl -X POST http://localhost:8000/api/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_name": "Alice Brown",
    "recipient_email": "alice@example.com",
    "personalized_message": "Happy Birthday Alice! Enjoy these amazing coffees!",
    "occasion": "birthday",
    "scheduled_delivery_date": "2025-03-15",
    "shipping_address": {
      "street": "789 Pine St",
      "city": "Portland",
      "state": "OR",
      "zip": "97201",
      "country": "USA"
    },
    "packaging_type": "premium",
    "include_greeting_card": true
  }'

# Response: {"success": true, "data": {"id": 1, "gift_code": "GIFT-ABC123"}}

# Step 2: Add coffee products
curl -X POST http://localhost:8000/api/gifts/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 3, "quantity": 1}
    ]
  }'

# Step 3: Checkout
curl -X POST http://localhost:8000/api/gifts/1/checkout

# Step 4: Confirm payment
curl -X POST http://localhost:8000/api/gifts/1/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{"transaction_id": "txn_12345"}'
```

---

### Example 2: Create and Use a Wedding Registry

```bash
# Step 1: Create registry
curl -X POST http://localhost:8000/api/registries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Emma & James Wedding Registry",
    "type": "wedding",
    "event_name": "Emma & James Wedding",
    "event_date": "2025-08-20",
    "registry_owner_name": "Emma Wilson",
    "co_owner_name": "James Anderson",
    "contact_email": "emma@example.com",
    "shipping_address": {
      "street": "321 Elm St",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "country": "USA"
    },
    "target_amount": 1000.00,
    "is_public": true
  }'

# Response: {"success": true, "data": {"id": 1, "registry_code": "REG-XYZ789"}}

# Step 2: Add curated coffee selections
curl -X POST http://localhost:8000/api/registries/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "item_name": "Ethiopian Yirgacheffe",
        "quantity_requested": 10,
        "priority": 1
      },
      {
        "product_id": 2,
        "item_name": "Colombian Supremo",
        "quantity_requested": 5,
        "priority": 2
      }
    ]
  }'

# Step 3: Activate registry
curl -X POST http://localhost:8000/api/registries/1/activate

# Step 4: Guest views registry (public access)
curl http://localhost:8000/api/registries/code/REG-XYZ789

# Step 5: Guest purchases from registry
curl -X POST http://localhost:8000/api/registries/1/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "registry_item_id": 1,
    "purchaser_name": "Bob Taylor",
    "purchaser_email": "bob@example.com",
    "quantity": 3,
    "amount": 56.97,
    "message_to_recipient": "Congratulations!",
    "is_anonymous": false
  }'

# Step 6: Confirm purchase payment
curl -X POST http://localhost:8000/api/registries/purchases/1/confirm \
  -H "Content-Type: application/json" \
  -d '{"transaction_id": "txn_reg_67890"}'
```

---

## 🧠 Business Logic

### Gift Builder Workflow

1. **Draft Creation**: Customer creates gift with recipient details
2. **Item Selection**: Add coffee products to gift box
3. **Customization**: Add personalized messages, select packaging
4. **Scheduling**: Choose delivery date and time preference
5. **Checkout**: System validates stock and reserves products
6. **Payment**: Customer completes payment
7. **Processing**: Gift is prepared and packaged
8. **Shipping**: Gift is shipped to recipient
9. **Delivery**: Recipient receives gift

### Gift Registry Workflow

**Registry Owner Side:**
1. Create registry with event details
2. Add curated coffee selections (or allow custom amounts)
3. Set privacy and display preferences
4. Activate registry
5. Share registry code with guests
6. Monitor fulfillment progress
7. Receive gifts when target is met

**Gift Giver Side:**
1. Receive registry code from couple/organization
2. View registry and available items
3. Select items to purchase
4. Add personal message
5. Complete payment
6. Receive confirmation

### Stock Management
- Products check stock before adding to gifts
- Stock is reserved during checkout
- Stock is deducted when payment is confirmed
- Failed payments release reserved stock

### Privacy Controls
- **Public registries**: Searchable, anyone with code can view
- **Private registries**: Only accessible with exact registry code
- **Anonymous purchases**: Hide purchaser name from registry owner
- **Show purchased items**: Control whether fulfilled items remain visible

### Priority System
Registry items have 3 priority levels:
- **Priority 1 (High)**: Must-have items, shown first
- **Priority 2 (Medium)**: Nice-to-have items
- **Priority 3 (Low)**: Optional items

### Partial Fulfillment
- Registry items can enable/disable partial fulfillment
- Allows multiple guests to contribute toward same item
- Tracks quantity_requested vs quantity_purchased
- Automatically calculates remaining quantity

---

## 🔐 Security Considerations

1. **Input Validation**: All inputs validated before processing
2. **SQL Injection**: Using Eloquent ORM with parameter binding
3. **Stock Verification**: Double-check stock before confirming orders
4. **Payment Integration**: Transaction IDs required for confirmation
5. **Access Control**: User-based permissions for registry/gift management
6. **Code Generation**: Unique codes prevent guessing/enumeration

---

## 🧪 Testing

### Manual Testing Checklist

**Gift Builder:**
- [ ] Create gift with all fields
- [ ] Add multiple products
- [ ] Update quantities
- [ ] Remove items
- [ ] Checkout with insufficient stock (should fail)
- [ ] Checkout with sufficient stock
- [ ] Confirm payment
- [ ] Track gift status

**Gift Registry:**
- [ ] Create registry
- [ ] Add curated items with products
- [ ] Add custom amount items (no product)
- [ ] Activate registry
- [ ] Search for public registry
- [ ] Purchase specific item
- [ ] Purchase custom amount
- [ ] Verify quantity updates
- [ ] Verify received amount calculation
- [ ] Test anonymous purchase
- [ ] Test partial fulfillment

---

## 📊 Database Indexes

For optimal performance, ensure these indexes exist:

```sql
-- Gifts
CREATE INDEX idx_gifts_code ON gifts(gift_code);
CREATE INDEX idx_gifts_status ON gifts(status);
CREATE INDEX idx_gifts_delivery_date ON gifts(scheduled_delivery_date);

-- Registries
CREATE INDEX idx_registries_code ON gift_registries(registry_code);
CREATE INDEX idx_registries_active ON gift_registries(is_active, status);
CREATE INDEX idx_registries_type ON gift_registries(type);

-- Products
CREATE INDEX idx_products_gifting ON products(available_for_gifting, is_active);
```

---

## 🔄 Status Workflows

### Gift Status Flow
```
draft → pending → paid → processing → shipped → delivered
                      ↓
                  cancelled
```

### Registry Status Flow
```
draft → active → completed
           ↓
       cancelled
```

### Purchase Status Flow
```
pending → completed
    ↓
refunded / cancelled
```

---

## 🎯 Future Enhancements

1. **Email Notifications**
   - Gift delivery confirmations
   - Registry purchase notifications
   - Thank you emails

2. **Gift Tracking**
   - Real-time shipping updates
   - Delivery notifications
   - Photo uploads of delivered gifts

3. **Advanced Analytics**
   - Popular gift combinations
   - Registry completion rates
   - Seasonal trends

4. **Social Features**
   - Share registries on social media
   - Registry wishlists
   - Gift recommendations

5. **Subscription Integration**
   - Gift subscription boxes
   - Recurring gift deliveries
   - Subscription registry items

6. **Mobile App**
   - iOS and Android apps
   - QR code scanning for registries
   - Push notifications

---

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Email: support@coffeecompany.com
- Documentation: /docs

---

## 📄 License

[Your License Here]

---

## 👥 Contributors

[Your Team/Contributors Here]

---

**Last Updated**: 2025-01-12
**Version**: 1.0.0
