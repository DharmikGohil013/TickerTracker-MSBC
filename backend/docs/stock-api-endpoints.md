# 📊 Stock Market API Endpoints - Postman Collection

## Base URL: `http://localhost:5000/api/stock`

---

## 🔐 Authentication
Most endpoints require JWT authentication. Include this header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📈 **1. GET Stock Quote**
**Endpoint:** `GET /api/stock/quote/:symbol`  
**Auth:** Required  
**Example:** `GET /api/stock/quote/AAPL`

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 237.88,
    "change": -1.11,
    "changePercent": "-0.4645%",
    "high": 239.66,
    "low": 234.67,
    "open": 238.99,
    "previousClose": 238.99,
    "volume": 44249576,
    "latestTradingDay": "2025-09-18",
    "source": "Alpha Vantage"
  }
}
```

---

## 🎯 **2. GET Comprehensive Stock Data**
**Endpoint:** `GET /api/stock/comprehensive/:symbol`  
**Auth:** Required  
**Example:** `GET /api/stock/comprehensive/AAPL`

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "alphaVantageQuote": { "symbol": "AAPL", "price": 237.88 },
    "finnhubQuote": { "currentPrice": 245.085, "change": 7.205 },
    "companyProfile": { "name": "Apple Inc", "country": "US" },
    "successfulAPIs": 3,
    "timestamp": "2025-09-20T..."
  }
}
```

---

## 🔍 **3. Search Stocks**
**Endpoint:** `GET /api/stock/search?q=query`  
**Auth:** Public  
**Example:** `GET /api/stock/search?q=Apple`

```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc",
      "type": "Equity",
      "region": "United States",
      "currency": "USD",
      "matchScore": 1.0
    }
  ],
  "count": 10,
  "query": "Apple"
}
```

---

## 📊 **4. GET Time Series Data**
**Endpoint:** `GET /api/stock/timeseries/:symbol?outputSize=compact`  
**Auth:** Required  
**Example:** `GET /api/stock/timeseries/AAPL?outputSize=compact`

```json
{
  "success": true,
  "data": [
    {
      "date": "2025-09-18",
      "open": 238.99,
      "high": 239.66,
      "low": 234.67,
      "close": 237.88,
      "volume": 44249576
    }
  ],
  "count": 100,
  "outputSize": "compact"
}
```

---

## 🏢 **5. GET Company Profile**
**Endpoint:** `GET /api/stock/profile/:symbol`  
**Auth:** Required  
**Example:** `GET /api/stock/profile/AAPL`

```json
{
  "success": true,
  "data": {
    "name": "Apple Inc",
    "country": "US",
    "currency": "USD",
    "exchange": "NASDAQ NMS - GLOBAL MARKET",
    "finnhubIndustry": "Technology",
    "ipo": "1980-12-12",
    "marketCapitalization": 3640644463283.738,
    "phone": "14089961010",
    "weburl": "https://www.apple.com/"
  }
}
```

---

## 📰 **6. GET Market News**
**Endpoint:** `GET /api/stock/news?category=general`  
**Auth:** Public  
**Example:** `GET /api/stock/news?category=general`

```json
{
  "success": true,
  "data": [
    {
      "category": "technology",
      "datetime": 1726854360,
      "headline": "Apple announces new iPhone features",
      "id": 126853074,
      "image": "https://...",
      "related": "AAPL",
      "source": "Finnhub",
      "summary": "Apple Inc announced...",
      "url": "https://..."
    }
  ],
  "count": 20,
  "category": "general"
}
```

---

## 📰 **7. GET Company News**
**Endpoint:** `GET /api/stock/news/:symbol?from=date&to=date`  
**Auth:** Required  
**Example:** `GET /api/stock/news/AAPL?from=2025-09-13&to=2025-09-20`

```json
{
  "success": true,
  "data": [
    {
      "category": "company",
      "datetime": 1726854360,
      "headline": "Apple reports quarterly earnings",
      "related": "AAPL",
      "source": "Finnhub",
      "summary": "Apple Inc reported...",
      "url": "https://..."
    }
  ],
  "count": 15,
  "symbol": "AAPL",
  "dateRange": { "from": "2025-09-13", "to": "2025-09-20" }
}
```

---

## 🌍 **8. GET Market Overview**
**Endpoint:** `GET /api/stock/overview`  
**Auth:** Public  
**Example:** `GET /api/stock/overview`

```json
{
  "success": true,
  "data": {
    "marketNews": [...],
    "majorIndices": {
      "spy": { "symbol": "SPY", "price": 662.26, "change": 1.23 },
      "qqq": { "symbol": "QQQ", "price": 595.32, "change": 2.15 },
      "dia": { "symbol": "DIA", "price": 462.63, "change": 0.87 }
    },
    "successfulCalls": 4,
    "timestamp": "2025-09-20T..."
  }
}
```

---

## 📊 **9. GET Polygon Aggregates**
**Endpoint:** `GET /api/stock/aggregates/:symbol?timespan=day&from=date&to=date`  
**Auth:** Required  
**Example:** `GET /api/stock/aggregates/AAPL?timespan=day&from=2025-09-01&to=2025-09-20`

```json
{
  "success": true,
  "data": [
    {
      "timestamp": 1726689600000,
      "date": "2025-09-18",
      "open": 238.99,
      "high": 239.66,
      "low": 234.67,
      "close": 237.88,
      "volume": 44249576,
      "source": "Polygon"
    }
  ],
  "count": 20,
  "timespan": "day"
}
```

---

## 🧪 **10. TEST All APIs**
**Endpoint:** `GET /api/stock/test`  
**Auth:** Required  
**Example:** `GET /api/stock/test`

```json
{
  "success": true,
  "message": "API Test Complete: 2/3 APIs working",
  "data": {
    "alphaVantage": { "status": "success", "message": "API working correctly" },
    "finnhub": { "status": "success", "message": "API working correctly" },
    "polygon": { "status": "error", "message": "Request failed with status code 404" }
  },
  "summary": {
    "workingAPIs": 2,
    "totalAPIs": 3,
    "healthScore": 67
  }
}
```

---

## 🔧 **Legacy Endpoints (Backward Compatibility)**

### **GET Stock Data (Legacy)**
**Endpoint:** `GET /api/stock/:symbol`  
**Auth:** Required  
**Example:** `GET /api/stock/AAPL`

### **GET Stock History (Legacy)**
**Endpoint:** `GET /api/stock/:symbol/history`  
**Auth:** Required  
**Example:** `GET /api/stock/AAPL/history`

---

## 📝 **Postman Environment Variables**

Set these variables in your Postman environment:

```json
{
  "baseUrl": "http://localhost:5000/api",
  "stockBaseUrl": "http://localhost:5000/api/stock",
  "authToken": "YOUR_JWT_TOKEN_HERE"
}
```

---

## 🚀 **Quick Test Commands**

### **1. Get JWT Token First:**
```
POST {{baseUrl}}/auth/login
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

### **2. Test Stock Quote:**
```
GET {{stockBaseUrl}}/quote/AAPL
Authorization: Bearer {{authToken}}
```

### **3. Search Stocks:**
```
GET {{stockBaseUrl}}/search?q=Tesla
```

### **4. Get Market News:**
```
GET {{stockBaseUrl}}/news?category=general
```

### **5. Test API Health:**
```
GET {{stockBaseUrl}}/test
Authorization: Bearer {{authToken}}
```

---

## ✅ **Working APIs Status:**
- ✅ **Alpha Vantage**: Stock quotes, search, time series
- ✅ **Finnhub**: Stock quotes, company profiles, market news
- ❌ **Polygon**: Limited access (may require paid plan)

---

## 🔗 **Import Postman Collection**

Create a new collection in Postman and import these endpoints to start testing immediately!

**Collection Name:** `TickerTracker Stock Market APIs`  
**Environment:** `TickerTracker Development`  

---

**🎉 All APIs are ready for testing in Postman!**