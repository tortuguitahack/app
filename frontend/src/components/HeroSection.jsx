import React from 'react';
import { ChevronRight } from 'lucide-react';

export const HeroSection = ({ onExploreClick }) => {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="grid-two-column">
          <div>
            <h1 className="hero-large" style={{ marginBottom: '24px' }}>
              Premium Spirits for the Discerning Connoisseur
            </h1>
            <p className="body-large" style={{ 
              marginBottom: '32px', 
              color: 'var(--text-secondary)',
              maxWidth: '480px'
            }}>
              Curated collection of the world's finest whiskeys, wines, and champagnes. 
              Each bottle represents exceptional craftsmanship and uncompromising quality.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button 
                className="btn-primary"
                onClick={onExploreClick}
              >
                Explore Collection
              </button>
              
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Learn More
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3aGlza2V5fGVufDB8fHx8MTc1NzgzNTE2NXww&ixlib=rb-4.1.0&q=85"
              alt="Premium liquor collection"
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '500px',
                objectFit: 'cover',
                borderRadius: '0px'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};