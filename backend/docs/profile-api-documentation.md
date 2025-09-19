# Profile API Documentation

## Base URL
```
http://localhost:5000/api/profile
```

## Authentication
All profile endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get User Profile
**GET** `/api/profile`

Get the complete user profile information including financial portfolio data.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "avatar_url",
      "phone": "+1234567890",
      "bio": "Trader and investor",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "country": "United States",
      "timezone": "America/New_York",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-12-19T00:00:00.000Z",
      
      // Financial Portfolio Data
      "portfolio": {
        "balances": {
          "usd": 10000,
          "inr": 1000000
        },
        "dailyPnL": {
          "usd": 250.50,
          "inr": -5000,
          "date": "2024-12-19T00:00:00.000Z"
        },
        "totalPnL": {
          "usd": 1500.75,
          "inr": 25000
        },
        "holdings": [
          {
            "symbol": "AAPL",
            "quantity": 10,
            "averagePrice": 150.50,
            "currency": "USD",
            "currentValue": 1550.00,
            "unrealizedPnL": 50.00
          }
        ],
        "tradingStats": {
          "totalTrades": 25,
          "winningTrades": 15,
          "losingTrades": 10,
          "winRate": 60.00,
          "bestTrade": 500.00,
          "worstTrade": -200.00
        },
        "performanceHistory": []
      },
      
      "preferences": {
        "defaultCurrency": "USD",
        "theme": "dark",
        "language": "en",
        "watchlist": [],
        "portfolios": [],
        "notifications": {
          "priceAlerts": true,
          "portfolioUpdates": true,
          "marketNews": false,
          "emailNotifications": true
        },
        "riskTolerance": "moderate",
        "investmentExperience": "intermediate"
      },
      
      "subscription": {
        "plan": "free",
        "isActive": true,
        "startDate": null,
        "endDate": null
      },
      
      "apiUsage": {
        "requestsToday": 45,
        "requestsThisMonth": 1200,
        "lastRequestTime": "2024-12-19T10:30:00.000Z"
      }
    }
  }
}
```

---

### 2. Update User Profile
**PUT** `/api/profile`

Update user profile information.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "bio": "Updated bio information",
  "dateOfBirth": "1990-01-01",
  "country": "Canada",
  "timezone": "America/Toronto",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      // Updated user object (same structure as GET /profile)
    }
  }
}
```

#### Validation Errors (400 Bad Request)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be in valid format"
    }
  ]
}
```

---

### 3. Update User Preferences
**PUT** `/api/profile/preferences`

Update user preferences including notifications, trading settings, etc.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "defaultCurrency": "INR",
  "theme": "light",
  "language": "hi",
  "notifications": {
    "priceAlerts": false,
    "portfolioUpdates": true,
    "marketNews": true,
    "emailNotifications": false
  },
  "riskTolerance": "aggressive",
  "investmentExperience": "advanced"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Preferences updated successfully",
  "data": {
    "preferences": {
      // Updated preferences object
    }
  }
}
```

---

### 4. Get Profile Statistics
**GET** `/api/profile/stats`

Get comprehensive profile statistics including account age, completion, financial performance, etc.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "stats": {
      "accountAge": {
        "days": 120,
        "createdAt": "2024-08-20T00:00:00.000Z"
      },
      "profileCompletion": {
        "percentage": 85,
        "completedFields": 7,
        "totalFields": 8
      },
      
      // Financial Portfolio Statistics
      "portfolio": {
        "currentBalances": {
          "usd": {
            "amount": 10500,
            "currency": "USD",
            "symbol": "$"
          },
          "inr": {
            "amount": 975000,
            "currency": "INR",
            "symbol": "₹"
          }
        },
        "initialInvestment": {
          "usd": {
            "amount": 10000,
            "currency": "USD",
            "symbol": "$"
          },
          "inr": {
            "amount": 1000000,
            "currency": "INR",
            "symbol": "₹"
          }
        },
        "performance": {
          "usd": {
            "gainLoss": 500,
            "returnPercent": 5.00,
            "status": "profit"
          },
          "inr": {
            "gainLoss": -25000,
            "returnPercent": -2.50,
            "status": "loss"
          }
        },
        "dailyPnL": {
          "usd": 300,
          "inr": -15000,
          "date": "2024-12-19T00:00:00.000Z",
          "usdStatus": "profit",
          "inrStatus": "loss"
        },
        "totalPnL": {
          "usd": 1500,
          "inr": 25000,
          "usdStatus": "profit",
          "inrStatus": "profit"
        },
        "holdings": {
          "count": 5,
          "totalValue": 15000.50,
          "diversity": 50
        },
        "trading": {
          "totalTrades": 25,
          "winningTrades": 15,
          "losingTrades": 10,
          "winRate": 60.00,
          "bestTrade": 500.00,
          "worstTrade": -200.00
        }
      },
      
      "preferences": {
        "watchlistCount": 3,
        "portfolioCount": 2,
        "defaultCurrency": "USD",
        "riskTolerance": "moderate",
        "investmentExperience": "intermediate"
      },
      
      "subscription": {
        "plan": "free",
        "isActive": true,
        "daysRemaining": null
      },
      
      "activity": {
        "lastLogin": "2024-12-19T10:30:00.000Z",
        "emailVerified": true,
        "totalLogins": 45
      },
      
      "apiUsage": {
        "requestsToday": 67,
        "requestsThisMonth": 1245,
        "lastRequestTime": "2024-12-19T11:45:00.000Z"
      }
    }
  }
}
```

---

## Testing in Postman

### Setup
1. **Create a new collection** called "TickerTracker Profile API"
2. **Set Collection Variables:**
   - `baseUrl`: `http://localhost:5000`
   - `token`: `<your_jwt_token_here>`

### Authentication Setup
1. Go to the **Authorization** tab in your collection
2. Set **Type** to "Bearer Token"
3. Set **Token** to `{{token}}`

### Test Sequence

#### 1. First Login to Get Token
**POST** `{{baseUrl}}/api/auth/login`
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
Copy the `token` from the response and set it as your collection variable.

#### 2. Get Profile
**GET** `{{baseUrl}}/api/profile`

#### 3. Update Profile
**PUT** `{{baseUrl}}/api/profile`
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "bio": "This is my updated bio",
  "phone": "+1234567890"
}
```

#### 4. Update Preferences
**PUT** `{{baseUrl}}/api/profile/preferences`
```json
{
  "defaultCurrency": "INR",
  "theme": "dark",
  "notifications": {
    "priceAlerts": true,
    "portfolioUpdates": true,
    "marketNews": false
  },
  "riskTolerance": "aggressive"
}
```

#### 5. Get Profile Statistics
**GET** `{{baseUrl}}/api/profile/stats`

---

## Rate Limiting
All profile endpoints are rate-limited:
- **100 requests per 15 minutes** per user
- Rate limit headers are included in responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1640000000
  ```

---

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Invalid token."
}
```

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "An error occurred while processing your request"
}
```

---

## Financial Portfolio Features

The profile API now includes comprehensive financial tracking:

### Default Balances
- **USD**: $10,000 starting balance
- **INR**: ₹10,00,000 starting balance

### Real-time Tracking
- Daily P&L calculation and reset
- Portfolio value computation
- Trading statistics
- Performance history
- Holdings management

### Financial Statistics
- Return percentage calculations
- Gain/loss tracking
- Win rate analysis
- Best/worst trade tracking
- Portfolio diversity metrics

---

## Notes
- All monetary values are returned as numbers (not strings)
- Dates are in ISO format
- Financial data is automatically calculated and updated
- Portfolio statistics are computed in real-time
- Currency symbols are included for display purposes