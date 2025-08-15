# Snacks Store - Hostel Delivery App

A simple, responsive snacks ordering website built with Next.js and MongoDB. Designed primarily for mobile use with a clean black theme.

## Features

### Customer Features
- Browse available snacks with images and descriptions
- Add items to cart with quantity selection
- Hostel and room number selection (defaults to Himalaya)
- Simple checkout process
- Responsive design optimized for mobile

### Admin Features
- PIN-based admin authentication (default PIN: 1234)
- View and manage orders (pending/completed status)
- Add new products to the store
- View current product inventory

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/snacks-store
   ADMIN_PIN=1234
   ```

4. Start MongoDB service (if using local installation)

5. Seed the database with sample products:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000 (or the port shown in terminal)

## Usage

### For Customers
1. Visit the main page to browse snacks
2. Click "Add to Cart" on items you want
3. Go to Cart to review items and adjust quantities
4. Select your hostel (default: Himalaya) and enter room number
5. Click "Place Order" to complete purchase

### For Admin
1. Click "Admin" link at bottom right of main page
2. Enter PIN (default: 1234)
3. View orders and mark them as completed
4. Add new products with images, prices, and descriptions

## File Structure

```
├── app/
│   ├── api/
│   │   ├── admin/auth/       # Admin authentication
│   │   ├── orders/           # Order management
│   │   └── products/         # Product management
│   ├── admin/                # Admin pages
│   ├── cart/                 # Shopping cart page
│   ├── globals.css           # Global styles (black theme)
│   ├── layout.js             # Root layout
│   └── page.js               # Main products page
├── lib/
│   └── mongodb.js            # Database connection
├── models/
│   ├── Product.js            # Product schema
│   └── Order.js              # Order schema
├── scripts/
│   └── seedProducts.js       # Sample data seeder
└── .env.local                # Environment variables
```

## Default Settings

- **Hostel Options**: Himalaya (default), Kailash, Everest, Annapurna
- **Admin PIN**: 1234 (change in .env.local)
- **Theme**: Black background with white text
- **Database**: Local MongoDB on port 27017

## Customization

- **Change hostel options**: Edit the select options in `app/cart/page.js`
- **Modify theme**: Update colors in `app/globals.css`
- **Change admin PIN**: Update `ADMIN_PIN` in `.env.local`
- **Add more product fields**: Modify the Product schema in `models/Product.js`

## Production Deployment

1. Set up MongoDB Atlas or production MongoDB instance
2. Update `MONGODB_URI` in environment variables
3. Build the application: `npm run build`
4. Start production server: `npm start`

## Sample Products Included

The seeder script includes 6 sample products:
- Chocolate Cookies (₹25)
- Potato Chips (₹20)  
- Energy Bar (₹35)
- Instant Noodles (₹15)
- Fruit Juice (₹30)
- Candy Pack (₹12, out of stock)

All products use sample images from Unsplash.