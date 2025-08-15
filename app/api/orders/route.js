import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).populate('items.productId').sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Check stock availability and update stock
    for (const item of data.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 });
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        }, { status: 400 });
      }
      
      // Reduce stock
      product.stock -= item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }
    
    const order = new Order(data);
    await order.save();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}