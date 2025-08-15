'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserId } from '../utils/userSession';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [hostelName, setHostelName] = useState('Himalaya');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(item => item._id === productId);
    if (item && newQuantity > item.stock) {
      showToast(`Only ${item.stock} available!`);
      return;
    }

    const updatedCart = cart.map(item =>
      item._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const removeFromCart = (productId) => {
    setRemovingItem(productId);
    setTimeout(() => {
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setRemovingItem(null);
      showToast('Item removed from cart');
    }, 300);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!roomNumber.trim()) {
      alert('Please enter your room number');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: getUserId(),
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        hostelName,
        roomNumber: roomNumber.trim(),
        totalAmount: getTotalAmount(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const orderData = await response.json();
        localStorage.removeItem('cart');
        setCart([]);
        router.push(`/order-confirmation/${orderData._id}`);
      } else {
        const errorData = await response.json();
        if (errorData.error && errorData.error.includes('stock')) {
          showToast(errorData.error);
        } else {
          showToast('Failed to place order. Try again.');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold hover:text-gray-300">
            ← Back
          </Link>
          <h1 className="text-lg">Cart</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-4">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-2">Your cart is empty</p>
            <Link
              href="/"
              className="bg-white text-black px-4 py-2 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">Your Items</h2>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex items-center space-x-4 border border-gray-800 rounded-lg p-4 transition-all duration-300 hover:border-gray-600 hover:shadow-lg transform ${
                      removingItem === item._id ? 'opacity-0 scale-95 -translate-x-full' : 'opacity-100 scale-100'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-400">₹{item.price} each</p>
                      <p className="text-green-400 text-sm font-medium">₹{item.price * item.quantity} total</p>
                      <p className={`text-xs ${
                        item.stock === 0 ? 'text-red-400' : 
                        item.stock <= 5 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        Stock: {item.stock || 0} available
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors text-sm"
                      >
                        -
                      </button>
                      <div className="bg-gray-900 px-2 py-1 rounded min-w-[35px] text-center text-sm">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`w-7 h-7 rounded flex items-center justify-center transition-colors text-sm ${
                          item.quantity >= item.stock 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Delivery Details</h2>
              <div className="space-y-6 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hostel Name
                  </label>
                  <select
                    value={hostelName}
                    onChange={(e) => setHostelName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-200"
                  >
                    <option value="Himalaya">Himalaya</option>
                    <option value="Kailash">Kailash</option>
                    <option value="Everest">Everest</option>
                    <option value="Annapurna">Annapurna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g., 301, A-205, etc."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-200"
                    required
                  />
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span>₹{getTotalAmount()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t border-gray-600 pt-3">
                    <span>Total:</span>
                    <span className="text-green-400">₹{getTotalAmount()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || !roomNumber.trim()}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform ${
                    loading || !roomNumber.trim()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>📦 Place Order</span>
                      <span className="text-sm">(₹{getTotalAmount()})</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 right-3 z-50 px-3 py-2 text-sm rounded bg-green-600 text-white">
          {toast}
        </div>
      )}
    </div>
  );
}