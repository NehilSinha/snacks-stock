'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 0
        }),
      });

      if (response.ok) {
        setNewProduct({
          name: '',
          price: '',
          description: '',
          image: '',
          stock: ''
        });
        fetchProducts();
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: parseInt(newStock) }),
      });

      if (response.ok) {
        fetchProducts();
        setEditingStock(null);
        alert('Stock updated successfully!');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-gray-300">
              Store
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-4">
        <div className="flex mb-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 text-sm border-b-2 ${
              activeTab === 'orders'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 text-sm border-b-2 ${
              activeTab === 'products'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Products ({products.length})
          </button>
        </div>

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-400">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-800 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-400">
                          Order ID: {order._id}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{order.totalAmount}</p>
                        <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                          <button
                            onClick={() => updateOrderStatus(order._id, 'pending')}
                            className={`px-2 py-1 rounded ${
                              order.status === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'preparing')}
                            className={`px-2 py-1 rounded ${
                              order.status === 'preparing'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Preparing
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'on-the-way')}
                            className={`px-2 py-1 rounded ${
                              order.status === 'on-the-way'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            On the way
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                            className={`px-2 py-1 rounded ${
                              order.status === 'delivered'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1 text-sm">Delivery</h4>
                        <p className="text-sm text-gray-400">{order.hostelName} - Room {order.roomNumber}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm">Items</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-xs text-gray-400">
                              {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Add New Product</h2>
                <form onSubmit={addProduct} className="space-y-3 border border-gray-800 rounded-lg p-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 h-24"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                    min="0"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-2 rounded hover:bg-gray-200"
                  >
                    Add Product
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Current Products</h2>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-800 rounded-lg p-3 flex items-start space-x-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-400">₹{product.price}</p>
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            Stock: {product.stock || 0}
                          </p>
                          {editingStock === product._id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                value={stockValue}
                                onChange={(e) => setStockValue(e.target.value)}
                                className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
                                min="0"
                              />
                              <button
                                onClick={() => updateStock(product._id, stockValue)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingStock(null)}
                                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingStock(product._id);
                                setStockValue(product.stock || 0);
                              }}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Edit Stock
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}