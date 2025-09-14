import React from 'react';
import { ChevronRight } from 'lucide-react';

export const CategoryGrid = ({ categories, onCategoryClick }) => {
  return (
    <section className="section-padding-small" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="hero-medium" style={{ marginBottom: '16px' }}>
            Explore Our Categories
          </h2>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            Discover exceptional spirits from around the world
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
              className="hover-lift"
              onClick={() => onCategoryClick(category.id)}
              style={{
                background: 'var(--bg-primary)',
                cursor: 'pointer',
                borderRadius: '0px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={category.image} 
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '48px 24px 24px 24px',
                  color: 'white'
                }}>
                  <h3 className="heading-2" style={{ marginBottom: '8px', color: 'white' }}>
                    {category.name}
                  </h3>
                  <p className="body-regular" style={{ 
                    marginBottom: '16px',
                    color: 'rgba(255,255,255,0.9)'
                  }}>
                    {category.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <span className="body-small" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {category.count} products
                    </span>
                    <ChevronRight size={20} style={{ color: 'white' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};