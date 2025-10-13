# Krishisetu Backend API

A Node.js + Express + MongoDB backend for the Krishisetu Agricultural Waste Management Platform.

## 🚀 Features

- **Role-based Authentication** (Farmer & Business)
- **OTP-based Registration** with email verification
- **Secure Password Storage** using bcrypt
- **JWT Token Authentication**
- **Email Service** using Nodemailer
- **MongoDB Integration** with Mongoose
- **Automatic OTP Expiration** (5 minutes TTL)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email service

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd Krishisetu_backend-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/krishisetu

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your_super_secret_jwt_key_here

   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

## 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🚀 Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/check-email` | Check if email exists | `{ email, role }` |
| POST | `/api/send-otp` | Send OTP to email | `{ email }` |
| POST | `/api/verify-otp` | Verify OTP | `{ email, otp }` |
| POST | `/api/register` | Register new user | `{ role, name, email, password }` |
| POST | `/api/login` | Login user | `{ role, email, password }` |

### Example Requests

#### Check Email
```bash
curl -X POST http://localhost:5000/api/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "role": "farmer"}'
```

#### Send OTP
```bash
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"role": "farmer", "name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

## 🔧 Database Models

### Farmer Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Business Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### OtpVerification Model
```javascript
{
  email: String,
  otp: String,
  createdAt: Date (TTL: 5 minutes)
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: 7-day expiration
- **OTP Expiration**: 5-minute TTL
- **Input Validation**: Email format, password length
- **CORS Protection**: Configured for frontend origin

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Complete Registration Flow
```bash
# 1. Check email
curl -X POST http://localhost:5000/api/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "role": "farmer"}'

# 2. Send OTP
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 3. Verify OTP (check your email for the OTP)
curl -X POST http://localhost:5000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'

# 4. Register user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"role": "farmer", "name": "Test User", "email": "test@example.com", "password": "password123"}'

# 5. Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"role": "farmer", "email": "test@example.com", "password": "password123"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`

2. **Email Not Sending**
   - Verify Gmail credentials
   - Check if 2FA is enabled
   - Ensure app password is correct

3. **CORS Errors**
   - Update `FRONTEND_URL` in `.env`
   - Check if frontend is running on correct port

### Debug Mode
```bash
npm run debug
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `EMAIL_USER` | Gmail address | Yes |
| `EMAIL_PASSWORD` | Gmail app password | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **Start Backend**: `npm run dev`
2. **Start Frontend**: `npm start` (in frontend directory)
3. **Test Flow**: Navigate to `http://localhost:3000/role-selection`

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Configure production email service
4. Set secure JWT secret

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Test with provided curl examples