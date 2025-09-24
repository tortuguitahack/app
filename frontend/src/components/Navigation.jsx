import React from 'react';
import { Search, ShoppingCart, User, Instagram, MessageCircle, Send, Facebook } from 'lucide-react';

export const Navigation = ({ cartCount, onCartClick, onSearchClick, onUserClick, user }) => {
  return (
    <header className="navigation-header">
      <div className="container">
        <div className="navigation-content">
          <a href="/" className="navigation-logo">
            Tambar Licorería
          </a>
          
          <nav className="navigation-menu">
            <a href="#whiskey" className="navigation-link">Whiskey</a>
            <a href="#wine" className="navigation-link">Vino</a>
            <a href="#champagne" className="navigation-link">Champán</a>
            <a href="#premium" className="navigation-link">Premium</a>
            <a href="#ofertas" className="navigation-link">Ofertas</a>
          </nav>

          <div className="navigation-utilities">
            {/* Social Media Icons */}
            <div className="social-icons">
              <a 
                href="https://wa.me/59176543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a 
                href="https://t.me/tambar_licoreria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title="Telegram"
              >
                <Send size={18} />
              </a>
              <a 
                href="https://facebook.com/tambar.licoreria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com/tambar.licoreria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://tiktok.com/@tambar.licoreria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title="TikTok"
                style={{ fontWeight: 'bold', fontSize: '16px' }}
              >
                📱
              </a>
            </div>

            {/* Search Button */}
            <button 
              onClick={onSearchClick}
              className="nav-icon-btn"
              title="Buscar productos"
            >
              <Search size={20} />
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="nav-icon-btn"
              style={{ position: 'relative' }}
              title="Carrito de compras"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* User Button */}
            <button 
              onClick={onUserClick}
              className="nav-icon-btn"
              title={user ? `Hola, ${user.name}` : "Iniciar sesión"}
              style={{ 
                color: user ? 'var(--gold-primary)' : 'var(--text-primary)' 
              }}
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};