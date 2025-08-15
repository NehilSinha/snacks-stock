'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'preparing': return 'bg-blue-600';
      case 'on-the-way': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'preparing': return 'Being Prepared';
      case 'on-the-way': return 'On the Way';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl mb-4">Order not found</h1>
          <Link href="/" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-3 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold hover:text-gray-300">
            ← Store
          </Link>
          <h1 className="text-lg">Order Confirmation</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-400 text-sm">Your order has been received and is being processed</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-mono text-sm">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-lg font-bold">₹{order.totalAmount}</p>
            </div>
          </div>

          <div className={`inline-block px-3 py-1 rounded text-sm text-white ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Delivery Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Hostel</p>
                <p>{order.hostelName}</p>
              </div>
              <div>
                <p className="text-gray-400">Room Number</p>
                <p>{order.roomNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-400">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p>Qty: {item.quantity}</p>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-400 text-sm">
            We&apos;ll update you as your order progresses. Expected delivery time: 15-30 minutes.
          </p>
          <div className="space-x-3">
            <Link
              href={`/track-order/${order._id}`}
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="bg-white text-black px-4 py-2 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}