import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const SearchModal = ({ isOpen, onClose, products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
      setFilteredProducts([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Header */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '24px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                placeholder="Search for whiskey, wine, champagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0px',
                  background: 'var(--bg-primary)',
                  fontSize: '16px',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: 'var(--bg-primary)',
        padding: '40px 0'
      }}>
        <div className="container">
          {searchQuery.trim() === '' ? (
            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
              <h3 className="heading-2" style={{ marginBottom: '16px' }}>
                Search Our Premium Collection
              </h3>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Find your perfect spirit by name, brand, or category
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
              <h3 className="heading-2" style={{ marginBottom: '16px' }}>
                No Results Found
              </h3>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h3 className="heading-2">
                  Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="grid-product-showcase">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};