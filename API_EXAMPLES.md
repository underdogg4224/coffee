# Gift Builder & Registry API Examples

Complete collection of API request/response examples for testing and integration.

## Table of Contents
- [Gift Builder Examples](#gift-builder-examples)
- [Gift Registry Examples](#gift-registry-examples)
- [Error Handling](#error-handling)

---

## Gift Builder Examples

### Example 1: Simple Birthday Gift Flow

#### Step 1: Create Draft Gift
```http
POST /api/gifts
Content-Type: application/json

{
  "recipient_name": "Sarah Miller",
  "recipient_email": "sarah.miller@email.com",
  "recipient_phone": "+1-555-0123",
  "personalized_message": "Happy 30th Birthday! Hope you enjoy these carefully selected coffees. Love, Mom",
  "occasion": "birthday",
  "scheduled_delivery_date": "2025-03-15",
  "delivery_time_preference": "afternoon",
  "shipping_address": {
    "street": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "OR",
    "zip": "97403",
    "country": "USA"
  },
  "packaging_type": "premium",
  "include_greeting_card": true,
  "greeting_card_design": "birthday-flowers",
  "is_surprise": true
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Gift created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "gift_code": "GIFT-KJ8H9G6F5D",
    "recipient_name": "Sarah Miller",
    "recipient_email": "sarah.miller@email.com",
    "recipient_phone": "+1-555-0123",
    "personalized_message": "Happy 30th Birthday! Hope you enjoy these carefully selected coffees. Love, Mom",
    "occasion": "birthday",
    "scheduled_delivery_date": "2025-03-15",
    "delivery_time_preference": "afternoon",
    "status": "draft",
    "total_amount": "0.00",
    "packaging_type": "premium",
    "include_greeting_card": true,
    "greeting_card_design": "birthday-flowers",
    "is_surprise": true,
    "created_at": "2025-01-12T10:30:00.000000Z",
    "updated_at": "2025-01-12T10:30:00.000000Z"
  }
}
```

#### Step 2: Add Coffee Products
```http
POST /api/gifts/42/items
Content-Type: application/json

{
  "items": [
    {
      "product_id": 15,
      "quantity": 2,
      "custom_notes": "Medium grind for drip coffee maker"
    },
    {
      "product_id": 23,
      "quantity": 1,
      "custom_notes": "Whole beans - she has a grinder"
    },
    {
      "product_id": 8,
      "quantity": 1,
      "custom_notes": null
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Items added to gift successfully",
  "data": {
    "id": 42,
    "gift_code": "GIFT-KJ8H9G6F5D",
    "total_amount": "74.96",
    "items": [
      {
        "id": 101,
        "gift_id": 42,
        "product_id": 15,
        "quantity": 2,
        "unit_price": "18.99",
        "subtotal": "37.98",
        "custom_notes": "Medium grind for drip coffee maker",
        "product": {
          "id": 15,
          "name": "Colombian Supremo",
          "description": "Rich and balanced with chocolate notes",
          "type": "coffee",
          "roast_level": "medium",
          "origin": "Colombia",
          "price": "18.99",
          "size": "340g",
          "image_url": "/images/colombian.jpg"
        }
      },
      {
        "id": 102,
        "gift_id": 42,
        "product_id": 23,
        "quantity": 1,
        "unit_price": "22.99",
        "subtotal": "22.99",
        "custom_notes": "Whole beans - she has a grinder",
        "product": {
          "id": 23,
          "name": "Kenya AA",
          "description": "Bright acidity with berry and wine notes",
          "type": "coffee",
          "roast_level": "light",
          "origin": "Kenya",
          "price": "22.99",
          "size": "250g"
        }
      },
      {
        "id": 103,
        "gift_id": 42,
        "product_id": 8,
        "quantity": 1,
        "unit_price": "13.99",
        "subtotal": "13.99",
        "custom_notes": null,
        "product": {
          "id": 8,
          "name": "House Blend",
          "description": "Smooth everyday coffee",
          "type": "coffee",
          "roast_level": "medium",
          "price": "13.99",
          "size": "500g"
        }
      }
    ]
  }
}
```

#### Step 3: Update Item Quantity
```http
PUT /api/gifts/42/items/101
Content-Type: application/json

{
  "quantity": 3
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 42,
    "total_amount": "93.95",
    "items": [
      {
        "id": 101,
        "quantity": 3,
        "subtotal": "56.97"
      }
    ]
  }
}
```

#### Step 4: Checkout Gift
```http
POST /api/gifts/42/checkout
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Gift checkout initiated",
  "data": {
    "gift": {
      "id": 42,
      "gift_code": "GIFT-KJ8H9G6F5D",
      "status": "pending",
      "total_amount": "93.95"
    },
    "payment_required": "93.95"
  }
}
```

#### Step 5: Confirm Payment
```http
POST /api/gifts/42/confirm-payment
Content-Type: application/json

{
  "transaction_id": "pi_3AbCdEfGhIjKlMnO"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment confirmed, gift will be processed",
  "data": {
    "id": 42,
    "gift_code": "GIFT-KJ8H9G6F5D",
    "status": "paid",
    "paid_at": "2025-01-12T10:45:23.000000Z"
  }
}
```

---

### Example 2: Corporate Holiday Gift

```http
POST /api/gifts
Content-Type: application/json

{
  "recipient_name": "TechCorp Team",
  "recipient_email": "office@techcorp.com",
  "personalized_message": "Thank you for an amazing year! Happy Holidays from the leadership team.",
  "occasion": "corporate",
  "scheduled_delivery_date": "2025-12-20",
  "delivery_time_preference": "morning",
  "shipping_address": {
    "street": "100 Tech Boulevard, Suite 500",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "USA"
  },
  "packaging_type": "luxury",
  "include_greeting_card": true,
  "greeting_card_design": "corporate-holiday",
  "is_surprise": false
}
```

Then add premium coffee selection:
```http
POST /api/gifts/43/items
Content-Type: application/json

{
  "items": [
    {"product_id": 31, "quantity": 10},
    {"product_id": 32, "quantity": 10},
    {"product_id": 35, "quantity": 5}
  ]
}
```

---

### Example 3: Query Available Products

```http
GET /api/gifts/products?roast_level=light&min_price=15&max_price=25
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "Ethiopian Yirgacheffe",
      "description": "Floral and citrus notes with bright acidity",
      "type": "coffee",
      "roast_level": "light",
      "origin": "Ethiopia",
      "price": "19.99",
      "size": "250g",
      "stock_quantity": 45,
      "available_for_gifting": true,
      "flavor_notes": ["floral", "citrus", "bergamot", "jasmine"]
    },
    {
      "id": 18,
      "name": "Costa Rica Tarrazu",
      "description": "Clean and crisp with honey sweetness",
      "type": "coffee",
      "roast_level": "light",
      "origin": "Costa Rica",
      "price": "17.99",
      "size": "340g",
      "stock_quantity": 32,
      "available_for_gifting": true,
      "flavor_notes": ["honey", "citrus", "clean"]
    },
    {
      "id": 23,
      "name": "Kenya AA",
      "description": "Bright acidity with berry and wine notes",
      "type": "coffee",
      "roast_level": "light",
      "origin": "Kenya",
      "price": "22.99",
      "size": "250g",
      "stock_quantity": 28,
      "available_for_gifting": true,
      "flavor_notes": ["berry", "wine", "blackcurrant", "bright"]
    }
  ]
}
```

---

### Example 4: Get User's All Gifts

```http
GET /api/gifts/user
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "gift_code": "GIFT-KJ8H9G6F5D",
      "recipient_name": "Sarah Miller",
      "occasion": "birthday",
      "status": "paid",
      "total_amount": "93.95",
      "scheduled_delivery_date": "2025-03-15",
      "created_at": "2025-01-12T10:30:00.000000Z"
    },
    {
      "id": 38,
      "gift_code": "GIFT-PL9M8N7B6V",
      "recipient_name": "John Smith",
      "occasion": "anniversary",
      "status": "delivered",
      "total_amount": "68.50",
      "delivered_at": "2025-01-05T14:22:00.000000Z"
    }
  ]
}
```

---

## Gift Registry Examples

### Example 1: Complete Wedding Registry Flow

#### Step 1: Create Wedding Registry
```http
POST /api/registries
Content-Type: application/json

{
  "title": "Emma & James's Coffee Wedding Registry",
  "description": "We're coffee lovers getting married! Help us build our home coffee collection with your favorite beans or contribute to our coffee journey.",
  "type": "wedding",
  "event_name": "Emma Wilson & James Anderson Wedding",
  "event_date": "2025-08-20",
  "registry_owner_name": "Emma Wilson",
  "co_owner_name": "James Anderson",
  "contact_email": "emma.wilson@email.com",
  "contact_phone": "+1-555-0199",
  "shipping_address": {
    "street": "1842 Maple Drive",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "country": "USA"
  },
  "is_public": true,
  "allow_custom_amounts": true,
  "show_purchased_items": false,
  "target_amount": 1200.00,
  "thank_you_message": "Your generous gift means the world to us! Thank you for helping us start our married life with amazing coffee.",
  "registry_start_date": "2025-02-01",
  "registry_end_date": "2025-09-01"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Registry created successfully",
  "data": {
    "id": 15,
    "user_id": 5,
    "registry_code": "REG-W3D9D1N8G2",
    "title": "Emma & James's Coffee Wedding Registry",
    "type": "wedding",
    "event_name": "Emma Wilson & James Anderson Wedding",
    "event_date": "2025-08-20",
    "registry_owner_name": "Emma Wilson",
    "co_owner_name": "James Anderson",
    "status": "draft",
    "is_public": true,
    "target_amount": "1200.00",
    "received_amount": "0.00",
    "created_at": "2025-01-12T11:00:00.000000Z"
  }
}
```

#### Step 2: Add Curated Coffee Selections
```http
POST /api/registries/15/items
Content-Type: application/json

{
  "items": [
    {
      "product_id": 15,
      "item_name": "Ethiopian Yirgacheffe",
      "item_description": "Our favorite morning coffee - bright and floral!",
      "item_price": 19.99,
      "quantity_requested": 8,
      "priority": 1,
      "allow_partial": true,
      "notes": "Prefer whole beans"
    },
    {
      "product_id": 22,
      "item_name": "Brazilian Santos",
      "item_description": "Perfect for espresso - James's favorite",
      "item_price": 21.99,
      "quantity_requested": 6,
      "priority": 1,
      "allow_partial": true,
      "notes": "Fine grind for espresso"
    },
    {
      "product_id": 8,
      "item_name": "House Blend",
      "item_description": "Everyday drinking coffee",
      "item_price": 13.99,
      "quantity_requested": 10,
      "priority": 2,
      "allow_partial": true,
      "notes": null
    },
    {
      "product_id": null,
      "item_name": "Coffee Subscription - 6 Months",
      "item_description": "Monthly coffee delivery for half a year",
      "item_price": 180.00,
      "quantity_requested": 1,
      "priority": 1,
      "allow_partial": false,
      "notes": "This would be amazing!"
    },
    {
      "product_id": 45,
      "item_name": "Premium Burr Grinder",
      "item_description": "We need a quality grinder!",
      "item_price": 299.99,
      "quantity_requested": 1,
      "priority": 1,
      "allow_partial": false,
      "notes": null
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Items added to registry successfully",
  "data": {
    "id": 15,
    "registry_code": "REG-W3D9D1N8G2",
    "items": [
      {
        "id": 201,
        "gift_registry_id": 15,
        "product_id": 15,
        "item_name": "Ethiopian Yirgacheffe",
        "item_description": "Our favorite morning coffee - bright and floral!",
        "item_price": "19.99",
        "quantity_requested": 8,
        "quantity_purchased": 0,
        "priority": 1,
        "is_curated": true,
        "allow_partial": true
      }
      // ... other items
    ]
  }
}
```

#### Step 3: Activate Registry
```http
POST /api/registries/15/activate
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Registry activated successfully",
  "data": {
    "id": 15,
    "registry_code": "REG-W3D9D1N8G2",
    "status": "active",
    "is_active": true
  }
}
```

#### Step 4: Guest Looks Up Registry
```http
GET /api/registries/code/REG-W3D9D1N8G2
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "registry_code": "REG-W3D9D1N8G2",
    "title": "Emma & James's Coffee Wedding Registry",
    "description": "We're coffee lovers getting married! Help us build our home coffee collection with your favorite beans or contribute to our coffee journey.",
    "type": "wedding",
    "event_name": "Emma Wilson & James Anderson Wedding",
    "event_date": "2025-08-20",
    "registry_owner_name": "Emma Wilson",
    "co_owner_name": "James Anderson",
    "contact_email": "emma.wilson@email.com",
    "is_public": true,
    "allow_custom_amounts": true,
    "target_amount": "1200.00",
    "received_amount": "159.95",
    "completion_percentage": 13.33,
    "items": [
      {
        "id": 201,
        "item_name": "Ethiopian Yirgacheffe",
        "item_description": "Our favorite morning coffee - bright and floral!",
        "item_price": "19.99",
        "quantity_requested": 8,
        "quantity_purchased": 3,
        "remaining_quantity": 5,
        "fulfillment_percentage": 37.50,
        "priority": 1,
        "allow_partial": true,
        "product": {
          "id": 15,
          "name": "Ethiopian Yirgacheffe",
          "image_url": "/images/ethiopian.jpg"
        }
      },
      {
        "id": 202,
        "item_name": "Brazilian Santos",
        "item_description": "Perfect for espresso - James's favorite",
        "item_price": "21.99",
        "quantity_requested": 6,
        "quantity_purchased": 0,
        "remaining_quantity": 6,
        "fulfillment_percentage": 0,
        "priority": 1,
        "allow_partial": true
      },
      {
        "id": 205,
        "item_name": "Premium Burr Grinder",
        "item_description": "We need a quality grinder!",
        "item_price": "299.99",
        "quantity_requested": 1,
        "quantity_purchased": 0,
        "remaining_quantity": 1,
        "fulfillment_percentage": 0,
        "priority": 1,
        "allow_partial": false
      }
    ]
  }
}
```

#### Step 5: Guest Purchases from Registry
```http
POST /api/registries/15/purchase
Content-Type: application/json

{
  "registry_item_id": 202,
  "purchaser_name": "Michael Roberts",
  "purchaser_email": "michael.roberts@email.com",
  "quantity": 3,
  "amount": 65.97,
  "message_to_recipient": "Congratulations on your upcoming wedding! Can't wait to celebrate with you both. Enjoy the coffee!",
  "is_anonymous": false
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Purchase initiated successfully",
  "data": {
    "id": 88,
    "gift_registry_id": 15,
    "gift_registry_item_id": 202,
    "purchaser_name": "Michael Roberts",
    "purchaser_email": "michael.roberts@email.com",
    "quantity": 3,
    "amount": "65.97",
    "message_to_recipient": "Congratulations on your upcoming wedding! Can't wait to celebrate with you both. Enjoy the coffee!",
    "status": "pending",
    "is_anonymous": false,
    "created_at": "2025-01-12T14:30:00.000000Z"
  }
}
```

#### Step 6: Confirm Purchase Payment
```http
POST /api/registries/purchases/88/confirm
Content-Type: application/json

{
  "transaction_id": "ch_3NxYzAbCdEfGhIjK"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Purchase confirmed successfully",
  "data": {
    "id": 88,
    "status": "completed",
    "purchased_at": "2025-01-12T14:32:15.000000Z",
    "transaction_id": "ch_3NxYzAbCdEfGhIjK",
    "registry": {
      "id": 15,
      "received_amount": "225.92"
    },
    "registryItem": {
      "id": 202,
      "quantity_purchased": 3,
      "remaining_quantity": 3
    }
  }
}
```

---

### Example 2: Corporate Coffee Registry

```http
POST /api/registries
Content-Type: application/json

{
  "title": "TechStartup Office Coffee Fund",
  "description": "Help keep our developers caffeinated! We're building an amazing office coffee culture.",
  "type": "corporate",
  "event_name": "Office Coffee Upgrade Program",
  "event_date": null,
  "registry_owner_name": "Sarah Chen - Office Manager",
  "co_owner_name": null,
  "contact_email": "sarah.chen@techstartup.com",
  "contact_phone": "+1-555-0177",
  "shipping_address": {
    "street": "500 Innovation Way",
    "city": "San Jose",
    "state": "CA",
    "zip": "95110",
    "country": "USA"
  },
  "is_public": false,
  "allow_custom_amounts": true,
  "show_purchased_items": true,
  "target_amount": 2000.00,
  "thank_you_message": "Thanks for supporting our coffee culture!",
  "registry_start_date": "2025-01-15",
  "registry_end_date": "2025-12-31"
}
```

---

### Example 3: Holiday Coffee Registry

```http
POST /api/registries
Content-Type: application/json

{
  "title": "Johnson Family Holiday Coffee Collection",
  "description": "This holiday season, instead of physical gifts, we'd love to receive coffee from around the world!",
  "type": "holiday",
  "event_name": "Johnson Family Holidays 2025",
  "event_date": "2025-12-25",
  "registry_owner_name": "The Johnson Family",
  "co_owner_name": null,
  "contact_email": "johnsons@email.com",
  "shipping_address": {
    "street": "88 Winter Lane",
    "city": "Denver",
    "state": "CO",
    "zip": "80202",
    "country": "USA"
  },
  "is_public": true,
  "allow_custom_amounts": true,
  "show_purchased_items": false,
  "target_amount": 500.00,
  "thank_you_message": "Your thoughtful gift brought warmth to our home this holiday season. Thank you!",
  "registry_start_date": "2025-11-01",
  "registry_end_date": "2025-12-31"
}
```

---

### Example 4: Search Public Registries

```http
GET /api/registries/search?type=wedding&search=wilson
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 15,
        "registry_code": "REG-W3D9D1N8G2",
        "title": "Emma & James's Coffee Wedding Registry",
        "type": "wedding",
        "event_name": "Emma Wilson & James Anderson Wedding",
        "event_date": "2025-08-20",
        "registry_owner_name": "Emma Wilson",
        "completion_percentage": 18.83
      },
      {
        "id": 22,
        "registry_code": "REG-M7N8B9V0C1",
        "title": "Sarah Wilson's Wedding Registry",
        "type": "wedding",
        "event_name": "Sarah Wilson & Tom Bradley Wedding",
        "event_date": "2025-09-15",
        "registry_owner_name": "Sarah Wilson",
        "completion_percentage": 45.20
      }
    ],
    "per_page": 20,
    "total": 2
  }
}
```

---

### Example 5: Anonymous Purchase

```http
POST /api/registries/15/purchase
Content-Type: application/json

{
  "registry_item_id": 201,
  "purchaser_name": "A Secret Admirer",
  "purchaser_email": "secret@email.com",
  "quantity": 2,
  "amount": 39.98,
  "message_to_recipient": "Wishing you both all the happiness!",
  "is_anonymous": true
}
```

When the registry owner views their purchases, anonymous ones will hide the purchaser details.

---

### Example 6: Custom Amount Contribution

```http
POST /api/registries/15/purchase
Content-Type: application/json

{
  "registry_item_id": null,
  "purchaser_name": "Linda Martinez",
  "purchaser_email": "linda.m@email.com",
  "quantity": 1,
  "amount": 50.00,
  "message_to_recipient": "Here's a little something toward your coffee fund!",
  "is_anonymous": false
}
```

This contributes $50 as a general gift without selecting a specific item.

---

### Example 7: Get Registry Details (Owner View)

```http
GET /api/registries/15
Authorization: Bearer {owner_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "registry_code": "REG-W3D9D1N8G2",
    "title": "Emma & James's Coffee Wedding Registry",
    "status": "active",
    "target_amount": "1200.00",
    "received_amount": "325.90",
    "completion_percentage": 27.16,
    "items": [
      {
        "id": 201,
        "item_name": "Ethiopian Yirgacheffe",
        "quantity_requested": 8,
        "quantity_purchased": 5,
        "remaining_quantity": 3,
        "purchases": [
          {
            "id": 85,
            "purchaser_name": "Alice Thompson",
            "quantity": 3,
            "amount": "59.97",
            "message_to_recipient": "Congrats!",
            "purchased_at": "2025-01-10T12:00:00Z"
          },
          {
            "id": 90,
            "purchaser_name": "Anonymous",
            "quantity": 2,
            "amount": "39.98",
            "is_anonymous": true,
            "purchased_at": "2025-01-12T14:32:00Z"
          }
        ]
      }
    ],
    "purchases": [
      {
        "id": 88,
        "purchaser_name": "Michael Roberts",
        "purchaser_email": "michael.roberts@email.com",
        "amount": "65.97",
        "status": "completed",
        "purchased_at": "2025-01-12T14:32:15Z"
      }
      // ... more purchases
    ]
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["validation error message"]
  }
}
```

---

### Example Validation Errors

#### Missing Required Fields
```http
POST /api/gifts
Content-Type: application/json

{
  "recipient_name": "John Doe"
}
```

**Response** (422 Unprocessable Entity):
```json
{
  "success": false,
  "errors": {
    "recipient_email": ["The recipient email field is required."],
    "shipping_address": ["The shipping address field is required."]
  }
}
```

---

#### Invalid Data Format
```http
POST /api/gifts
Content-Type: application/json

{
  "recipient_email": "not-an-email",
  "scheduled_delivery_date": "2024-01-01"
}
```

**Response** (422 Unprocessable Entity):
```json
{
  "success": false,
  "errors": {
    "recipient_email": ["The recipient email must be a valid email address."],
    "scheduled_delivery_date": ["The scheduled delivery date must be a date after today."]
  }
}
```

---

### Example Business Logic Errors

#### Insufficient Stock
```http
POST /api/gifts/42/checkout
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Insufficient stock for Ethiopian Yirgacheffe"
}
```

---

#### Cannot Delete Active Registry with Purchases
```http
DELETE /api/registries/15
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Cannot delete registry with completed purchases"
}
```

---

#### Registry Not Found
```http
GET /api/registries/code/INVALID-CODE
```

**Response** (404 Not Found):
```json
{
  "success": false,
  "message": "No query results for model [App\\Models\\GiftRegistry]"
}
```

---

#### Registry Not Available
```http
GET /api/registries/code/REG-PRIVATE123
```

**Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Registry not available"
}
```

---

#### Cannot Purchase from Expired Registry
```http
POST /api/registries/20/purchase
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Registry is not available for purchases"
}
```

---

#### Partial Fulfillment Not Allowed
```http
POST /api/registries/15/purchase
Content-Type: application/json

{
  "registry_item_id": 205,
  "quantity": 2
}
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Requested quantity exceeds remaining quantity"
}
```

---

## Testing Tips

1. **Use Postman or Insomnia**: Import these examples into REST clients for easy testing

2. **Test Flow Sequentially**: Follow the numbered steps in each example

3. **Save IDs**: Keep track of created IDs (gift_id, registry_id, etc.) for subsequent requests

4. **Test Edge Cases**:
   - Empty gift box checkout
   - Stock exhaustion
   - Expired registries
   - Invalid codes
   - Negative quantities

5. **Authentication**: Add authentication headers when testing with real user accounts

6. **Database State**: Reset database between test runs for consistent results

---

**Last Updated**: 2025-01-12
