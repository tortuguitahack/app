import React from 'react';
import { ProductCard } from './ProductCard';
import { Package, Sparkles } from 'lucide-react';

export const ProductGrid = ({ products, onAddToCart, title = "Nuestra Colección" }) => {
  if (!products || products.length === 0) {
    return (
      <section className="section-padding-small">
        <div className="container">
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--bg-subtle)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}>
              <Package size={32} color="var(--text-muted)" />
            </div>
            
            <h3 className="heading-2" style={{ 
              marginBottom: '16px',
              color: 'var(--text-muted)'
            }}>
              No hay productos disponibles
            </h3>
            <p className="body-large" style={{ color: 'var(--text-muted)' }}>
              Pronto tendremos nuevos productos premium para ti
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding-small" style={{ 
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Sparkles size={24} color="var(--gold-primary)" />
            <h2 className="hero-medium">
              {title}
            </h2>
            <Sparkles size={24} color="var(--gold-primary)" />
          </div>
          
          <p className="body-large" style={{ color: 'var(--text-muted)' }}>
            Selección cuidadosa de licores premium de clase mundial
          </p>

          {/* Product Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="heading-2" style={{ color: 'var(--gold-primary)' }}>
                {products.length}
              </div>
              <div className="body-small" style={{ color: 'var(--text-muted)' }}>
                Productos
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div className="heading-2" style={{ color: 'var(--gold-primary)' }}>
                {products.filter(p => p.featured).length}
              </div>
              <div className="body-small" style={{ color: 'var(--text-muted)' }}>
                Destacados
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div className="heading-2" style={{ color: 'var(--gold-primary)' }}>
                {products.filter(p => p.inStock).length}
              </div>
              <div className="body-small" style={{ color: 'var(--text-muted)' }}>
                Disponibles
              </div>
            </div>
          </div>
        </div>

        <div className="grid-product-showcase">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Premium Badge */}
        {products.some(p => p.featured) && (
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '20px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <p className="body-regular" style={{ 
              color: 'var(--gold-primary)',
              fontWeight: '500'
            }}>
              ✨ Productos marcados como <strong>Destacado</strong> son nuestras recomendaciones premium
            </p>
          </div>
        )}
      </div>
    </section>
  );
};