import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from 'sonner';

// Components
import { AgeVerification } from "./components/AgeVerification";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductGrid } from "./components/ProductGrid";
import { SearchModal } from "./components/SearchModal";
import { LoginModal } from "./components/LoginModal";
import { CartModal } from "./components/CartModal";
import { PaymentModal } from "./components/PaymentModal";

// API Services
import { 
  productsAPI, 
  categoriesAPI, 
  cartAPI, 
  authAPI, 
  paymentAPI,
  generateSessionId 
} from "./services/api";

const Home = () => {
  // State management
  const [user, setUser] = useState(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Modal states
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(generateSessionId());

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check age verification
      const ageVerified = localStorage.getItem('ageVerified');
      if (ageVerified === 'true') {
        setIsAgeVerified(true);
      }

      // Check authentication
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      if (token && userData) {
        try {
          await authAPI.verify(token);
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }

      // Load initial data
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadCart()
      ]);

    } catch (error) {
      console.error('App initialization error:', error);
      toast.error('Error al cargar la aplicación');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async (filters = {}) => {
    try {
      const response = await productsAPI.getAll(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar categorías');
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartAPI.get(sessionId);
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Event handlers
  const handleAgeVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsAgeVerified(true);
    toast.success('¡Bienvenido a Tambar Licorería!', {
      description: 'Disfruta navegando nuestra colección premium'
    });
  };

  const handleAgeDeny = () => {
    toast.error('Acceso denegado', {
      description: 'Debes ser mayor de 18 años para acceder'
    });
    setTimeout(() => {
      window.location.href = 'https://www.google.com';
    }, 2000);
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      setShowLogin(false);
      
      toast.success(`¡Bienvenido, ${userData.name}!`, {
        description: 'Has iniciado sesión correctamente'
      });
    } catch (error) {
      throw new Error('Credenciales incorrectas');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await cartAPI.addItem(sessionId, {
        productId: product.id,
        quantity: 1
      });
      
      setCart(response.data);
      toast.success('Producto agregado', {
        description: `${product.name} agregado al carrito`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar producto al carrito');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(productId);
        return;
      }
      
      const response = await cartAPI.updateItem(sessionId, productId, newQuantity);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.removeItem(sessionId, productId);
      await loadCart();
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear(sessionId);
      setCart({ items: [] });
      toast.success('Carrito vaciado');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error al vaciar carrito');
    }
  };

  const handleCheckout = async () => {
    try {
      if (cart.items.length === 0) {
        toast.error('El carrito está vacío');
        return;
      }

      const orderData = {
        sessionId,
        customerInfo: {
          name: user ? user.name : 'Cliente',
          email: user ? user.email : 'cliente@tambar.com'
        },
        paymentMethod: 'qr_code'
      };

      const response = await paymentAPI.createOrder(orderData);
      setPaymentData(response.data);
      setShowCart(false);
      setShowPayment(true);
      
      toast.success('Pedido creado', {
        description: 'Procede con el pago usando el código QR'
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error al crear el pedido');
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      await paymentAPI.simulatePayment(orderId);
      await loadCart(); // Reload cart (should be empty now)
      setShowPayment(false);
      setPaymentData(null);
      
      toast.success('¡Pago exitoso!', {
        description: 'Tu pedido ha sido procesado correctamente'
      });
    } catch (error) {
      console.error('Payment success error:', error);
      toast.error('Error al procesar el pago');
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    loadProducts({ category: categoryId });
    
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

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getFilteredProducts = () => {
    if (!selectedCategory) {
      return products.filter(product => product.featured);
    }
    return products;
  };

  const getProductTitle = () => {
    if (!selectedCategory) {
      return "Productos Destacados";
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? `Colección ${category.name}` : "Nuestra Colección";
  };

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid var(--gold-primary)',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <p className="body-large" style={{ color: 'var(--gold-primary)' }}>
            Cargando Tambar Licorería...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)'
          }
        }}
      />

      {/* Age Verification Modal */}
      <AgeVerification
        isOpen={!isAgeVerified}
        onVerify={handleAgeVerify}
        onDeny={handleAgeDeny}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        products={products}
        onAddToCart={handleAddToCart}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        user={user}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        orderData={paymentData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Navigation */}
      <Navigation
        cartCount={getCartItemCount()}
        onCartClick={() => setShowCart(true)}
        onSearchClick={() => setShowSearch(true)}
        onUserClick={() => setShowLogin(true)}
        user={user}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection onExploreClick={handleExploreClick} />

        {/* Categories Section */}
        <div id="categories">
          <CategoryGrid
            categories={categories}
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
              onClick={() => {
                setSelectedCategory(null);
                loadProducts();
              }}
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        padding: '80px 0 40px 0',
        borderTop: '2px solid var(--gold-primary)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 className="heading-2" style={{ 
                marginBottom: '16px',
                color: 'var(--gold-primary)',
                fontFamily: 'Playfair Display, serif'
              }}>
                Tambar Licorería
              </h3>
              <p className="body-regular" style={{ 
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}>
                Curando los mejores licores del mundo para conocedores exigentes desde 1985.
                Calidad premium y servicio excepcional.
              </p>
            </div>
            
            <div>
              <h4 className="body-large" style={{ 
                marginBottom: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Categorías
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {categories.map(category => (
                  <li key={category.id} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="body-small"
                      style={{ 
                        color: 'var(--text-muted)', 
                        textDecoration: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--gold-primary)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="body-large" style={{ 
                marginBottom: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Contacto
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p className="body-small" style={{ color: 'var(--text-muted)' }}>
                  📱 WhatsApp: +591 76543210
                </p>
                <p className="body-small" style={{ color: 'var(--text-muted)' }}>
                  📧 Email: info@tambar.bo
                </p>
                <p className="body-small" style={{ color: 'var(--text-muted)' }}>
                  📍 La Paz, Bolivia
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <p className="body-small" style={{ color: 'var(--text-muted)' }}>
              © 2025 Tambar Licorería. Todos los derechos reservados. 
              <span style={{ color: 'var(--gold-primary)', fontWeight: '500' }}>
                {' '}Bebe con Responsabilidad.
              </span>
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
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;