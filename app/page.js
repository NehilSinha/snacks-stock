'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const cartButtonRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const filterProducts = () => {
    let filtered = products;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
    return categories.sort();
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      syncCartWithLatestProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const syncCartWithLatestProducts = (latestProducts) => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const updatedCart = cartItems.map(cartItem => {
        const latestProduct = latestProducts.find(p => p._id === cartItem._id);
        return latestProduct ? { ...cartItem, stock: latestProduct.stock, inStock: latestProduct.inStock } : cartItem;
      });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const updateProductQuantity = (product, change) => {
    if (product.stock === 0 && change > 0) {
      showToast('Item out of stock!');
      return;
    }

    const existingItem = cart.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item from cart
        updatedCart = cart.filter(item => item._id !== product._id);
        showToast('Removed from cart!');
      } else if (newQuantity > product.stock) {
        showToast(`Only ${product.stock} available!`);
        return;
      } else {
        updatedCart = cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
        showToast(change > 0 ? 'Added to cart!' : 'Updated cart!');
      }
    } else if (change > 0) {
      // Add new item to cart
      updatedCart = [...cart, { ...product, quantity: 1 }];
      showToast('Added to cart!');
    } else {
      return; // Can't decrease if not in cart
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getProductQuantityInCart = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return <LoadingSpinner message="Loading delicious snacks..." />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold">Snacks Store</h1>
          <div className="flex items-center space-x-2">
            <Link
              href="/orders"
              className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/cart"
              className="bg-white text-black px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 py-4">
        <SearchBar onSearch={setSearchQuery} />
        <CategoryFilter 
          categories={getUniqueCategories()}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-2">No snacks available</p>
            <p className="text-gray-400 text-sm">Check back later!</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-2">No snacks found</p>
            <p className="text-gray-400 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : 'Try a different category'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border border-gray-800 rounded p-3 hover:border-gray-600 transition-colors"
              >
                <div className="relative overflow-hidden rounded mb-3 bg-gray-900">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Gbz9kIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  {(!product.inStock || product.stock === 0) && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
                      <span className="text-white text-xs bg-red-600 px-2 py-1 rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold mb-1 truncate">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-1 line-clamp-2">{product.description}</p>
                <p className={`text-xs mb-2 ${
                  product.stock === 0 ? 'text-red-400' : 
                  product.stock <= 5 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  Stock: {product.stock || 0} {product.stock <= 5 && product.stock > 0 ? '(Low!)' : ''}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">₹{product.price}</span>
                  {getProductQuantityInCart(product._id) === 0 ? (
                    <button
                      onClick={() => updateProductQuantity(product, 1)}
                      disabled={!product.inStock || product.stock === 0}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        product.inStock && product.stock > 0
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {(product.inStock && product.stock > 0) ? 'Add' : 'Out'}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateProductQuantity(product, -1)}
                        className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors text-xs"
                      >
                        -
                      </button>
                      <span className="bg-gray-900 px-2 py-1 rounded text-xs min-w-[24px] text-center">
                        {getProductQuantityInCart(product._id)}
                      </span>
                      <button
                        onClick={() => updateProductQuantity(product, 1)}
                        disabled={getProductQuantityInCart(product._id) >= product.stock}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors text-xs ${
                          getProductQuantityInCart(product._id) >= product.stock
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Link
        href="/admin"
        className="fixed bottom-3 right-3 text-xs text-gray-500 hover:text-gray-300"
      >
        Admin
      </Link>


      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 right-3 z-50 px-3 py-2 text-sm rounded bg-green-600 text-white">
          {toast}
        </div>
      )}
    </div>
  );
}
