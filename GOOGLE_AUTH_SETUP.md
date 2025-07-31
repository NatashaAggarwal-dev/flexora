# 🔐 Google Authentication & Supabase Integration Setup

## **📋 Prerequisites**
- ✅ Google Cloud Console project: `your_project_id`
- ✅ Google OAuth Client ID: `your_client_id`
- ✅ Supabase project: `https://xlvkjdqeisqksnuvlqxh.supabase.co`

## **🚀 Step 1: Set Up Supabase Database**

### **1.1 Run Database Setup Script**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `supabase_database_setup.sql`
4. Click **Run** to execute the script

### **1.2 Verify Tables Created**
The script will create these tables:
- ✅ `profiles` - User profile information
- ✅ `orders` - Order details
- ✅ `order_items` - Individual items in orders
- ✅ `user_addresses` - User shipping/billing addresses
- ✅ `user_preferences` - User preferences and settings

## **🔧 Step 2: Configure Supabase Auth**

### **2.1 Enable Google OAuth Provider**
1. Go to **Authentication > Providers** in Supabase Dashboard
2. Find **Google** provider
3. Click **Enable**
4. Enter your Google OAuth credentials:
   - **Client ID**: `your_client_id`
   - **Client Secret**: `your_client_secret`

### **2.2 Configure Redirect URLs**
Add these redirect URLs to your Google OAuth configuration:
- `https://xlvkjdqeisqksnuvlqxh.supabase.co/auth/v1/callback`
- `http://localhost:5173/auth/callback` (for development)

## **🌐 Step 3: Configure Google Cloud Console**

### **3.1 Add Authorized Redirect URIs**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `your_project_id`
3. Navigate to **APIs & Services > Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add these **Authorized redirect URIs**:
   ```
   https://xlvkjdqeisqksnuvlqxh.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   http://localhost:5180/auth/callback
   ```

### **3.2 Enable Required APIs**
1. Go to **APIs & Services > Library**
2. Enable these APIs:
   - ✅ Google+ API
   - ✅ Google People API
   - ✅ Google OAuth2 API

## **🔧 Step 4: Test the Integration**

### **4.1 Start Development Server**
```bash
npm run dev
```

### **4.2 Test Authentication Flow**
1. Click **Sign In** in the header
2. Click **Continue with Google**
3. Complete Google OAuth flow
4. Verify user profile is created in Supabase

### **4.3 Test Order Creation**
1. Add items to cart
2. Click **Proceed to Payment**
3. Verify order is saved to Supabase
4. Check order appears in Account Menu

## **📊 Step 5: Monitor Data**

### **5.1 Check Supabase Tables**
Go to **Table Editor** in Supabase Dashboard to verify:
- ✅ User profiles are created
- ✅ Orders are saved
- ✅ Order items are linked correctly

### **5.2 Monitor Auth Logs**
Go to **Authentication > Logs** to see:
- ✅ Successful sign-ins
- ✅ Failed authentication attempts
- ✅ User session management

## **🔒 Security Features**

### **Row Level Security (RLS)**
- ✅ Users can only access their own data
- ✅ Orders are protected by user ID
- ✅ Addresses are user-specific
- ✅ Preferences are private 