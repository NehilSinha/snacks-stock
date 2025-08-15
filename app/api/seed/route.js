import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

const sampleProducts = [
  {
    name: "Chocolate Cookies",
    price: 25,
    description: "Delicious chocolate chip cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    stock: 50,
    inStock: true
  },
  {
    name: "Potato Chips",
    price: 20,
    description: "Crispy salted potato chips",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
    stock: 30,
    inStock: true
  },
  {
    name: "Energy Bar",
    price: 35,
    description: "Healthy energy bar with nuts",
    image: "https://images.unsplash.com/photo-1571092918219-7950a6c9a999?w=400&h=300&fit=crop",
    stock: 25,
    inStock: true
  },
  {
    name: "Instant Noodles",
    price: 15,
    description: "Quick and tasty instant noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    stock: 40,
    inStock: true
  },
  {
    name: "Fruit Juice",
    price: 30,
    description: "Fresh mixed fruit juice",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
    stock: 20,
    inStock: true
  },
  {
    name: "Candy Pack",
    price: 12,
    description: "Assorted candy pack",
    image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&h=300&fit=crop",
    stock: 0,
    inStock: false
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    
    return NextResponse.json({ 
      message: `Successfully seeded ${products.length} products`,
      products 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed products' }, { status: 500 });
  }
}