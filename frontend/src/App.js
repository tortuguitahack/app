import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import { AgeVerification } from "./components/AgeVerification";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductGrid } from "./components/ProductGrid";
import { SearchModal } from "./components/SearchModal";

// Mock data
import { mockProducts, mockCategories, mockUser } from "./data/mock";

const Home = () => {
  const [user, setUser] = useState(mockUser);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // Check if age verification is needed
  useEffect(() => {
    const isVerified = localStorage.getItem('ageVerified');
    if (isVerified === 'true') {
      setUser(prev => ({ ...prev, isAgeVerified: true }));
    }
  }, []);

  const handleAgeVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    setUser(prev => ({ ...prev, isAgeVerified: true }));
  };

  const handleAgeDeny = () => {
    alert('You must be 21 or older to access this website.');
    window.location.href = 'https://www.google.com';
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCartClick = () => {
    console.log('Cart clicked:', cart);
    // Here you would typically open a cart modal or navigate to cart page
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getFilteredProducts = () => {
    if (!selectedCategory) {
      return mockProducts.filter(product => product.featured);
    }
    return mockProducts.filter(product => product.category === selectedCategory);
  };

  const getProductTitle = () => {
    if (!selectedCategory) {
      return "Featured Products";
    }
    const category = mockCategories.find(cat => cat.id === selectedCategory);
    return category ? `${category.name} Collection` : "Our Collection";
  };

  return (
    <div>
      {/* Age Verification Modal */}
      <AgeVerification
        isOpen={!user.isAgeVerified}
        onVerify={handleAgeVerify}
        onDeny={handleAgeDeny}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        products={mockProducts}
        onAddToCart={handleAddToCart}
      />

      {/* Navigation */}
      <Navigation
        cartCount={getCartItemCount()}
        onCartClick={handleCartClick}
        onSearchClick={() => setShowSearch(true)}
      />

      {/* Hero Section */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* Categories Section */}
      <div id="categories">
        <CategoryGrid
          categories={mockCategories}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* Products Section */}
      <div id="products">
        <ProductGrid
          products={getFilteredProducts()}
          onAddToCart={handleAddToCart}
          title={getProductTitle()}
        />
      </div>

      {/* Filter Reset */}
      {selectedCategory && (
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <button
            className="btn-secondary"
            onClick={() => setSelectedCategory(null)}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        padding: '80px 0 40px 0',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 className="heading-3" style={{ marginBottom: '16px' }}>
                Élite Licores
              </h3>
              <p className="body-regular" style={{ color: 'var(--text-secondary)' }}>
                Curating the world's finest spirits for discerning connoisseurs since 1985.
              </p>
            </div>
            <div>
              <h4 className="body-regular" style={{ marginBottom: '16px', fontWeight: '600' }}>
                Categories
              </h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#whiskey" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    Whiskey
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#wine" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    Wine
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#champagne" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    Champagne
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="body-regular" style={{ marginBottom: '16px', fontWeight: '600' }}>
                Contact
              </h4>
              <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Phone: +1 (555) 123-4567
              </p>
              <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email: info@elitelicores.com
              </p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <p className="body-small" style={{ color: 'var(--text-light)' }}>
              © 2025 Élite Licores. All rights reserved. Please drink responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;