import React, { useState } from 'react';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';

export const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;
    
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 500); // Brief delay for UX
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card hover-lift">
      <div style={{ position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover'
          }}
        />
        
        {/* Product Badges */}
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          {product.featured && (
            <div style={{
              background: 'var(--gold-primary)',
              color: 'var(--bg-primary)',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '4px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Destacado
            </div>
          )}
          
          {!product.inStock && (
            <div style={{
              background: 'var(--status-error)',
              color: 'white',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Agotado
            </div>
          )}
        </div>

        {/* Rating Stars */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '2px'
        }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={14} 
              fill="var(--gold-primary)" 
              color="var(--gold-primary)" 
            />
          ))}
        </div>
      </div>
      
      <div style={{ padding: '24px' }}>
        {/* Product Info */}
        <div style={{ marginBottom: '16px' }}>
          <h3 className="heading-3" style={{ 
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            {product.name}
          </h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px' 
          }}>
            <p className="body-small" style={{ color: 'var(--gold-primary)' }}>
              {product.brand}
            </p>
            <p className="body-small" style={{ color: 'var(--text-muted)' }}>
              {product.alcohol}% ABV
            </p>
          </div>
        </div>
        
        <p className="body-small" style={{ 
          color: 'var(--text-muted)', 
          marginBottom: '20px',
          lineHeight: '1.5',
          display: '-webkit-box',
          '-webkit-line-clamp': 2,
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
        
        {/* Price and Add to Cart */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <span className="heading-2" style={{ 
              color: 'var(--gold-primary)',
              fontFamily: 'Playfair Display, serif'
            }}>
              <span className="currency">Bs</span> {formatPrice(product.price)}
            </span>
            
            {product.inventory > 0 && product.inventory <= 5 && (
              <p style={{
                fontSize: '12px',
                color: 'var(--status-warning)',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                ¡Solo quedan {product.inventory}!
              </p>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={product.inStock ? 'btn-primary' : 'btn-secondary'}
            style={{
              minWidth: '140px',
              opacity: product.inStock ? 1 : 0.5,
              cursor: product.inStock && !isAdding ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}
          >
            {isAdding ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {product.inStock ? 'Agregar' : 'Agotado'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};