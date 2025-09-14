import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="hover-lift" style={{ 
      background: 'var(--bg-primary)',
      border: 'none',
      borderRadius: '0px',
      padding: '0',
      overflow: 'hidden',
      cursor: 'pointer',
      position: 'relative'
    }}>
      <div style={{ position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '280px',
            objectFit: 'cover',
            marginBottom: '16px'
          }}
        />
        {product.featured && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'var(--interactive-base)',
            color: 'var(--bg-primary)',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Featured
          </div>
        )}
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--status-error)',
            color: 'var(--bg-primary)',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Out of Stock
          </div>
        )}
      </div>
      
      <div style={{ padding: '0 16px 16px 16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <h3 className="heading-3" style={{ marginBottom: '4px' }}>
            {product.name}
          </h3>
          <p className="body-small" style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
            {product.brand} • {product.alcohol}% ABV
          </p>
        </div>
        
        <p className="body-small" style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: '16px',
          lineHeight: '1.4'
        }}>
          {product.description}
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span className="heading-3" style={{ color: 'var(--interactive-base)' }}>
            ${product.price}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{
              background: product.inStock ? 'transparent' : 'var(--bg-subtle)',
              color: product.inStock ? 'var(--interactive-base)' : 'var(--text-light)',
              border: `1px solid ${product.inStock ? 'var(--interactive-base)' : 'var(--border-light)'}`,
              borderRadius: '0px',
              padding: '12px 16px',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: product.inStock ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (product.inStock) {
                e.target.style.background = 'var(--interactive-base)';
                e.target.style.color = 'var(--bg-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (product.inStock) {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--interactive-base)';
              }
            }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};