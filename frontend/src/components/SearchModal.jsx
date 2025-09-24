import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Star } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const SearchModal = ({ isOpen, onClose, products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Todos', count: products.length },
    { id: 'whiskey', name: 'Whiskey', count: products.filter(p => p.category === 'whiskey').length },
    { id: 'wine', name: 'Vino', count: products.filter(p => p.category === 'wine').length },
    { id: 'champagne', name: 'Champán', count: products.filter(p => p.category === 'champagne').length },
    { id: 'featured', name: 'Destacados', count: products.filter(p => p.featured).length }
  ];

  useEffect(() => {
    if (!isOpen) return;

    let filtered = products;

    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'featured') {
        filtered = filtered.filter(product => product.featured);
      } else {
        filtered = filtered.filter(product => product.category === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedFilter, products, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
      setSelectedFilter('all');
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
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Search Header */}
      <div style={{
        background: 'var(--gradient-card)',
        padding: '24px',
        borderBottom: '2px solid var(--gold-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 101
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold-primary)'
                }}
              />
              <input
                type="text"
                placeholder="Buscar whiskey, vino, champán, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '2px solid var(--border-subtle)',
                  borderRadius: '8px',
                  background: 'var(--bg-subtle)',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            <button
              onClick={onClose}
              className="nav-icon-btn"
              style={{ 
                background: 'var(--bg-subtle)',
                border: '2px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                style={{
                  background: selectedFilter === filter.id ? 'var(--gold-primary)' : 'var(--bg-subtle)',
                  color: selectedFilter === filter.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                  border: selectedFilter === filter.id ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {filter.id === 'featured' && <Star size={14} />}
                {filter.id !== 'all' && filter.id !== 'featured' && <Filter size={14} />}
                {filter.name}
                <span style={{
                  background: selectedFilter === filter.id ? 'rgba(0,0,0,0.2)' : 'var(--gold-primary)',
                  color: selectedFilter === filter.id ? 'var(--bg-primary)' : 'var(--bg-primary)',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {filter.count}
                </span>
              </button>
            ))}
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
          {searchQuery.trim() === '' && selectedFilter === 'all' ? (
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <Search size={32} color="var(--bg-primary)" />
              </div>
              
              <h3 className="heading-2" style={{ 
                marginBottom: '16px',
                color: 'var(--gold-primary)'
              }}>
                Busca en Nuestra Colección Premium
              </h3>
              <p className="body-large" style={{ color: 'var(--text-muted)' }}>
                Encuentra tu licor perfecto por nombre, marca, categoría o descripción
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
              <h3 className="heading-2" style={{ 
                marginBottom: '16px',
                color: 'var(--text-muted)'
              }}>
                No se encontraron resultados
              </h3>
              <p className="body-large" style={{ color: 'var(--text-muted)' }}>
                Intenta con diferentes palabras clave o filtros
              </p>
              
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="btn-secondary"
                style={{ marginTop: '24px' }}
              >
                Limpiar Búsqueda
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h3 className="heading-2" style={{ color: 'var(--gold-primary)' }}>
                  {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </h3>
                
                {searchQuery && (
                  <p className="body-regular" style={{ 
                    color: 'var(--text-muted)',
                    marginTop: '8px'
                  }}>
                    para "{searchQuery}"
                    {selectedFilter !== 'all' && ` en ${filters.find(f => f.id === selectedFilter)?.name}`}
                  </p>
                )}
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