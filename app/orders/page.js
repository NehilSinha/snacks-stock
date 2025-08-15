'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserId } from '../utils/userSession';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = getUserId();
      const response = await fetch(`/api/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const filterOrders = (orders, filter) => {
    switch (filter) {
      case 'ongoing':
        return orders.filter(order => ['pending', 'preparing', 'on-the-way'].includes(order.status));
      case 'completed':
        return orders.filter(order => order.status === 'delivered');
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders(orders, activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold hover:text-gray-300">
            ← Snacks Store
          </Link>
          <h1 className="text-lg">My Orders</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 py-4">
        {/* Filter Tabs */}
        <div className="flex mb-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-3 py-2 text-sm border-b-2 ${
              activeTab === 'ongoing'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Ongoing ({filterOrders(orders, 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-2 text-sm border-b-2 ${
              activeTab === 'completed'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Completed ({filterOrders(orders, 'completed').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-lg mb-2">
              {activeTab === 'ongoing' && 'No ongoing orders'}
              {activeTab === 'completed' && 'No completed orders yet'}
              {activeTab === 'all' && 'No orders yet'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {activeTab === 'all' && 'Start shopping to see your orders here!'}
              {activeTab === 'ongoing' && 'All your orders are completed!'}
              {activeTab === 'completed' && 'Complete some orders to see them here!'}
            </p>
            <Link
              href="/"
              className="bg-white text-black px-4 py-2 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">#{order._id.slice(-8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{order.totalAmount}</p>
                    <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Delivery to</p>
                    <p className="text-sm">{order.hostelName} - Room {order.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Items</p>
                    <p className="text-sm">{order.items.length} item(s)</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-gray-400">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/track-order/${order._id}`}
                    className="bg-blue-600 text-white px-3 py-1.5 text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Track Order
                  </Link>
                  <Link
                    href={`/order-confirmation/${order._id}`}
                    className="bg-gray-700 text-white px-3 py-1.5 text-xs rounded hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </Link>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => {
                        // Add to cart again functionality
                        const cartItems = order.items.map(item => ({
                          _id: item.productId,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity
                        }));
                        localStorage.setItem('cart', JSON.stringify(cartItems));
                        window.location.href = '/cart';
                      }}
                      className="bg-green-700 text-white px-3 py-1.5 text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}