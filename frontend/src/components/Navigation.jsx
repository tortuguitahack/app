import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';

export const Navigation = ({ cartCount, onCartClick, onSearchClick }) => {
  return (
    <header className="navigation-header">
      <div className="container">
        <div className="navigation-content">
          <a href="/" className="navigation-logo">
            Élite Licores
          </a>
          
          <nav className="navigation-menu">
            <a href="#whiskey" className="navigation-link">Whiskey</a>
            <a href="#wine" className="navigation-link">Wine</a>
            <a href="#champagne" className="navigation-link">Champagne</a>
            <a href="#collections" className="navigation-link">Collections</a>
            <a href="#about" className="navigation-link">About</a>
          </nav>

          <div className="navigation-utilities">
            <button 
              onClick={onSearchClick}
              className="btn-secondary"
              style={{ padding: '8px' }}
            >
              <Search size={20} />
            </button>
            
            <button 
              onClick={onCartClick}
              className="btn-secondary"
              style={{ padding: '8px', position: 'relative' }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--interactive-base)',
                    color: 'var(--bg-primary)',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="btn-secondary" style={{ padding: '8px' }}>
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};