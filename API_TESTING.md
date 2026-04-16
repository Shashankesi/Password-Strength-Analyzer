# 🔌 API Testing Guide

## Testing the Password Strength Analyzer API

This guide provides examples for testing the API endpoints using curl, JavaScript fetch, or Postman.

---

## Prerequisites

- Backend server running on `http://localhost:5000`
- `curl` command-line tool (for curl examples)
- Or Postman/Insomnia (for GUI-based testing)

---

## 1. Health Check

**Endpoint:** `GET /api/health`

### curl
```bash
curl http://localhost:5000/api/health
```

### Expected Response
```json
{
  "status": "ok",
  "service": "Password Strength Analyzer"
}
```

---

## 2. Analyze Password

**Endpoint:** `POST /api/analyze`

### curl
```bash
# Simple password
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"test123"}'

# Complex password
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"MySecurePass@123!"}'
```

### JavaScript Fetch
```javascript
fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: 'MyPassword123!' })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Postman
1. Set request type to `POST`
2. URL: `http://localhost:5000/api/analyze`
3. Body (JSON):
```json
{
  "password": "MySecurePass@123!"
}
```
4. Click Send

### Expected Response (Full Example)
```json
{
  "password_length": 19,
  "charset_size": 94,
  "charset_info": {
    "has_lowercase": true,
    "has_uppercase": true,
    "has_digits": true,
    "has_special": true
  },
  "entropy": 124.5,
  "strength": "very_strong",
  "strength_color": "#2ed573",
  "combinations": 2.456e20,
  "crack_time": {
    "seconds": 123000000000000000,
    "minutes": 2050000000000000,
    "hours": 34166666666666.66,
    "days": 1423611111111.11,
    "years": 3906535964.67,
    "display": "3.91 billion years"
  },
  "recommendations": [
    {
      "type": "excellent",
      "icon": "✓",
      "text": "Excellent password! Strong character mix and length.",
      "priority": "info"
    }
  ],
  "graph_data": {
    "length_vs_combinations": [
      {
        "length": 1,
        "combinations": 94,
        "log_combinations": 1.97,
        "is_current": false
      },
      // ... more data points
    ],
    "crack_time_comparison": [
      {
        "name": "Digits Only",
        "length": 19,
        "charset_size": 10,
        "years": 38.17,
        "display": "38.17 years",
        "color": "#ff4757",
        "is_current": false
      },
      // ... more comparisons
    ]
  },
  "timestamp": "2024-01-15T10:30:45.123456"
}
```

---

## 3. Get Analysis History

**Endpoint:** `GET /api/history`

### curl
```bash
curl http://localhost:5000/api/history
```

### JavaScript Fetch
```javascript
fetch('http://localhost:5000/api/history')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### Expected Response
```json
{
  "history": [
    {
      "id": 1,
      "length": 12,
      "entropy": 78.5,
      "strength": "strong",
      "crack_time_display": "125.50 days",
      "timestamp": "2024-01-15T10:30:00"
    },
    {
      "id": 2,
      "length": 19,
      "entropy": 124.5,
      "strength": "very_strong",
      "crack_time_display": "3.91 billion years",
      "timestamp": "2024-01-15T10:35:00"
    }
  ],
  "count": 2
}
```

---

## 4. Clear History

**Endpoint:** `DELETE /api/history`

### curl
```bash
curl -X DELETE http://localhost:5000/api/history
```

### JavaScript Fetch
```javascript
fetch('http://localhost:5000/api/history', {
    method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Expected Response
```json
{
  "message": "History cleared"
}
```

---

## 5. Generate Strong Password

**Endpoint:** `POST /api/generate-password`

### curl
```bash
# Default length (16)
curl -X POST http://localhost:5000/api/generate-password \
  -H "Content-Type: application/json" \
  -d '{"length":16}'

# Custom length
curl -X POST http://localhost:5000/api/generate-password \
  -H "Content-Type: application/json" \
  -d '{"length":20}'
```

### JavaScript Fetch
```javascript
fetch('http://localhost:5000/api/generate-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ length: 16 })
})
.then(response => response.json())
.then(data => {
    console.log('Generated password:', data.generated_password);
    console.log('Analysis:', data);
})
.catch(error => console.error('Error:', error));
```

### Expected Response
```json
{
  "password_length": 16,
  "charset_size": 94,
  "charset_info": {
    "has_lowercase": true,
    "has_uppercase": true,
    "has_digits": true,
    "has_special": true
  },
  "entropy": 105.3,
  "strength": "very_strong",
  "strength_color": "#2ed573",
  "recommendations": [...],
  "graph_data": {...},
  "generated_password": "K9mP@xQ2vL&nRs1T",
  "timestamp": "2024-01-15T10:40:00"
}
```

---

## Test Cases

### Test Case 1: Weak Password
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"1234"}'
```

**Expected:** Entropy < 28, strength = "weak"

### Test Case 2: Moderate Password
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"password123"}'
```

**Expected:** Entropy 28-50, strength = "moderate"

### Test Case 3: Strong Password
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"MyPassword123"}'
```

**Expected:** Entropy 50-80, strength = "strong"

### Test Case 4: Very Strong Password
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"MySecurePass@2024#xyz"}'
```

**Expected:** Entropy >= 80, strength = "very_strong"

### Test Case 5: Empty Password
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":""}'
```

**Expected:** Error 400 with message "Password cannot be empty"

### Test Case 6: Missing Password Field
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** Error 400 with message "Password field is required"

---

## Postman Collection Template

Import this into Postman to test all endpoints easily:

```json
{
  "info": {
    "name": "Password Strength Analyzer API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Analyze Password",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/analyze",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"password\":\"MyPassword123!\"}"
        }
      }
    },
    {
      "name": "Get History",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/history"
      }
    },
    {
      "name": "Clear History",
      "request": {
        "method": "DELETE",
        "url": "http://localhost:5000/api/history"
      }
    },
    {
      "name": "Generate Password",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/generate-password",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"length\":16}"
        }
      }
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Password field is required"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred during analysis"
}
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test single request
ab -n 1 -c 1 http://localhost:5000/api/health

# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:5000/api/health

# Test with POST data
ab -n 100 -c 5 -p data.json -T application/json \
  http://localhost:5000/api/analyze
```

### Load Testing with wrk

```bash
# Install: https://github.com/wg/wrk

# Basic load test
wrk -t8 -c400 -d30s http://localhost:5000/api/health

# With POST script
wrk -t8 -c400 -d30s -s script.lua http://localhost:5000/api/analyze
```

---

## Debugging Tips

### View Detailed Response
```bash
curl -v -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"test"}'
```

### Pretty Print JSON
```bash
curl -s http://localhost:5000/api/health | python -m json.tool
```

### Save Response to File
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"password":"test"}' > response.json
```

### Monitor Network with tcpdump
```bash
sudo tcpdump -i lo -n 'tcp port 5000'
```

---

## Common Issues & Solutions

### Issue: Connection Refused
```
curl: (7) Failed to connect to localhost port 5000
```
**Solution:** Ensure Flask server is running: `python app.py`

### Issue: CORS Error in Frontend
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure Flask-CORS is installed: `pip install Flask-CORS`

### Issue: Invalid JSON
```json
{"error": "400 Bad Request"}
```
**Solution:** Check JSON syntax - use tools like [jsonlint.com](https://jsonlint.com/)

---

## API Monitoring

### Server Logs
```bash
# Follow logs in real-time
tail -f logs/app.log

# Or view Flask output in terminal where server is running
```

### Health Check Script
```bash
#!/bin/bash
# Check API health every 30 seconds

while true; do
  status=$(curl -s http://localhost:5000/api/health)
  echo "$(date): $status"
  sleep 30
done
```

---

**Happy Testing! 🎉**
