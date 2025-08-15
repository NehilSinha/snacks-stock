import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    const adminPin = process.env.ADMIN_PIN || '1234';

    if (pin === adminPin) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}