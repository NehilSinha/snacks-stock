'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchOrder();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchOrder, 30000);
      return () => clearInterval(interval);
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

  const getStatusInfo = (currentStatus) => {
    const statuses = [
      { key: 'pending', label: 'Order Received', icon: '📝' },
      { key: 'preparing', label: 'Being Prepared', icon: '👨‍🍳' },
      { key: 'on-the-way', label: 'On the Way', icon: '🛵' },
      { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const currentIndex = statuses.findIndex(s => s.key === currentStatus);
    
    return statuses.map((status, index) => ({
      ...status,
      isActive: index <= currentIndex,
      isCurrent: status.key === currentStatus,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading order status...</p>
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

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-3 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold hover:text-gray-300">
            ← Back
          </Link>
          <h1 className="text-lg">Track Order</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-mono text-sm">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-lg font-bold">₹{order.totalAmount}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>Ordered: {new Date(order.createdAt).toLocaleString()}</p>
            <p>{order.hostelName} - Room {order.roomNumber}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-6 text-center">Order Status</h3>
          
          <div className="space-y-4">
            {statusInfo.map((status, index) => (
              <div key={status.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                  status.isActive 
                    ? status.isCurrent 
                      ? 'bg-blue-600 text-white animate-pulse' 
                      : 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {status.isActive ? status.icon : '⚪'}
                </div>
                
                <div className="ml-4 flex-1">
                  <p className={`font-medium ${status.isActive ? 'text-white' : 'text-gray-400'}`}>
                    {status.label}
                  </p>
                  {status.isCurrent && (
                    <p className="text-xs text-blue-400 mt-1">Current Status</p>
                  )}
                </div>

                {index < statusInfo.length - 1 && (
                  <div className={`absolute left-4 mt-8 w-0.5 h-6 ${
                    status.isActive ? 'bg-green-600' : 'bg-gray-700'
                  }`} style={{ marginLeft: '15px' }} />
                )}
              </div>
            ))}
          </div>

          {order.status === 'delivered' && (
            <div className="mt-6 p-4 bg-green-900 bg-opacity-30 rounded-lg border border-green-600">
              <p className="text-green-400 text-center font-medium">
                🎉 Order Delivered! Enjoy your snacks!
              </p>
            </div>
          )}

          {order.status !== 'delivered' && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {order.status === 'pending' && 'We\'re preparing your order...'}
                {order.status === 'preparing' && 'Your order is being prepared with care!'}
                {order.status === 'on-the-way' && 'Your delivery is on the way!'}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Expected delivery: 15-30 minutes • Updates every 30 seconds
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-3">
          <button
            onClick={fetchOrder}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors mr-2"
          >
            Refresh Status
          </button>
          <Link
            href="/"
            className="bg-white text-black px-4 py-2 text-sm rounded hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}