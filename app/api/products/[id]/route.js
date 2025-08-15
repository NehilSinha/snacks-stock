import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id } = await params;
    
    // If stock is being updated, also update inStock status
    if (data.stock !== undefined) {
      data.inStock = data.stock > 0;
    }
    
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}