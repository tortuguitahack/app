import React from 'react';
import { ChevronRight, Package } from 'lucide-react';

export const CategoryGrid = ({ categories, onCategoryClick }) => {
  return (
    <section className="section-padding-small" style={{ 
      background: 'var(--bg-secondary)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="hero-medium" style={{ marginBottom: '16px' }}>
            Explora Nuestras Categorías
          </h2>
          <p className="body-large" style={{ color: 'var(--text-muted)' }}>
            Descubre espíritus excepcionales de todo el mundo
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card hover-lift"
              onClick={() => onCategoryClick(category.id)}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={category.image} 
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '60px 24px 24px 24px',
                  color: 'white'
                }}>
                  <h3 className="heading-2" style={{ 
                    marginBottom: '8px', 
                    color: 'var(--gold-primary)',
                    fontFamily: 'Playfair Display, serif'
                  }}>
                    {category.name}
                  </h3>
                  
                  <p className="body-regular" style={{ 
                    marginBottom: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5'
                  }}>
                    {category.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} style={{ color: 'var(--gold-primary)' }} />
                      <span className="body-small" style={{ 
                        color: 'var(--gold-primary)',
                        fontWeight: '500'
                      }}>
                        {category.count} productos disponibles
                      </span>
                    </div>
                    
                    <div style={{
                      background: 'var(--gold-primary)',
                      borderRadius: '50%',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ChevronRight size={16} style={{ color: 'var(--bg-primary)' }} />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'rgba(212, 175, 55, 0.1)',
                  opacity: '0',
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};