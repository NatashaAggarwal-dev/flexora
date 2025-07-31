# Flexora Backend API

A complete eCommerce backend system built with Node.js, Express, and PostgreSQL for the Flexora website.

## 🚀 Features

### Authentication System
- **Email/Password Registration & Login**
- **Phone OTP Authentication**
- **Google OAuth Integration**
- **JWT-based Session Management**
- **Secure Password Hashing (bcrypt)**

### User Management
- **User Profiles & Addresses**
- **Profile Updates & Password Changes**
- **Address Management (Shipping/Billing)**

### Product Management
- **Product Catalog with Categories**
- **Stock Management**
- **Product Search & Filtering**
- **Featured Products**

### Order System
- **Shopping Cart Integration**
- **Order Creation & Management**
- **Order Status Tracking**
- **Order Cancellation**

### Payment Integration
- **Razorpay Payment Gateway**
- **Payment Verification**
- **Refund Processing**
- **Payment History**

### Admin Panel
- **Dashboard Analytics**
- **User Management**
- **Order Management**
- **Product Management**
- **Order Status Updates**

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Payment**: Razorpay
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=flexora_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Razorpay Configuration
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key

   # Email Configuration (for OTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb flexora_db
   
   # Run schema
   psql -d flexora_db -f database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/send-otp`
Send OTP to phone number.

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and login/register.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com"
}
```

#### POST `/api/auth/google`
Google OAuth login/register.

**Request Body:**
```json
{
  "googleId": "google_user_id",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### User Endpoints

#### GET `/api/users/profile`
Get user profile and addresses.

**Headers:** `Authorization: Bearer <token>`

#### PUT `/api/users/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

#### GET `/api/users/addresses`
Get user addresses.

**Headers:** `Authorization: Bearer <token>`

#### POST `/api/users/addresses`
Add new address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "phone": "+919876543210",
  "addressType": "shipping",
  "isDefault": true
}
```

### Product Endpoints

#### GET `/api/products`
Get all products with filtering and pagination.

**Query Parameters:**
- `category`: Filter by category
- `subcategory`: Filter by subcategory
- `search`: Search in name and description
- `sort`: Sort field (default: created_at)
- `order`: Sort order (ASC/DESC, default: DESC)
- `limit`: Items per page (default: 20)
- `page`: Page number (default: 1)

#### GET `/api/products/:id`
Get single product by ID.

#### GET `/api/products/categories/list`
Get all product categories.

#### GET `/api/products/search/:query`
Search products by query.

#### GET `/api/products/featured/list`
Get featured products.

### Order Endpoints

#### POST `/api/orders`
Create new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  },
  "billingAddress": {
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  },
  "notes": "Special delivery instructions"
}
```

#### GET `/api/orders/my-orders`
Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status`: Filter by status
- `limit`: Items per page (default: 10)
- `page`: Page number (default: 1)

#### GET `/api/orders/:id`
Get order details.

**Headers:** `Authorization: Bearer <token>`

#### PUT `/api/orders/:id/cancel`
Cancel order.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/orders/track/:orderNumber`
Track order by order number (public).

**Query Parameters:**
- `email`: Customer email (required for guest tracking)

### Payment Endpoints

#### POST `/api/payments/create-order`
Create Razorpay payment order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": "uuid",
  "amount": 29999,
  "currency": "INR"
}
```

#### POST `/api/payments/verify`
Verify payment signature.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": "uuid",
  "paymentId": "razorpay_payment_id",
  "signature": "payment_signature"
}
```

#### GET `/api/payments/status/:orderId`
Get payment status.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/payments/history`
Get payment history.

**Headers:** `Authorization: Bearer <token>`

### Admin Endpoints

#### GET `/api/admin/dashboard`
Get dashboard statistics.

**Headers:** `Authorization: Bearer <token>` (Admin required)

#### GET `/api/admin/users`
Get all users.

**Headers:** `Authorization: Bearer <token>` (Admin required)

#### PUT `/api/admin/users/:id/status`
Update user status.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "isActive": true
}
```

#### GET `/api/admin/orders`
Get all orders.

**Headers:** `Authorization: Bearer <token>` (Admin required)

#### PUT `/api/admin/orders/:id/status`
Update order status.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "status": "shipped",
  "description": "Order shipped via courier",
  "location": "Mumbai",
  "trackingNumber": "TRK123456"
}
```

#### GET `/api/admin/products`
Get all products.

**Headers:** `Authorization: Bearer <token>` (Admin required)

#### POST `/api/admin/products`
Create new product.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "name": "Flexora Smart Chair",
  "description": "Ergonomic office chair with smart features",
  "price": 29999,
  "originalPrice": 34999,
  "category": "Office Chairs",
  "subcategory": "Smart Chairs",
  "stockQuantity": 50,
  "images": ["image1.jpg", "image2.jpg"],
  "features": {
    "posture_monitoring": true,
    "wireless_charging": true
  },
  "specifications": {
    "weight_capacity": "150kg",
    "warranty": "2 years"
  }
}
```

## 🔐 Security Features

- **JWT Authentication** with token blacklisting
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **SQL Injection Prevention** with parameterized queries

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=flexora_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Razorpay (Production keys)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_live_secret

# Email (Production SMTP)
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name flexora-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 📝 Database Schema

The database includes the following tables:
- `users` - User accounts and profiles
- `user_addresses` - User shipping/billing addresses
- `products` - Product catalog
- `orders` - Order information
- `order_items` - Individual items in orders
- `payments` - Payment records
- `order_tracking` - Order status tracking
- `user_sessions` - JWT token blacklisting
- `otp_codes` - Phone verification OTPs
- `admin_users` - Admin user permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Updates

- **v1.0.0** - Initial release with complete eCommerce functionality
- Authentication system with multiple providers
- Order management and tracking
- Payment integration with Razorpay
- Admin panel for management
- Comprehensive API documentation 