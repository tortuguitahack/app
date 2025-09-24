import React from 'react';
import { ChevronRight, Award, Shield, Truck } from 'lucide-react';

export const HeroSection = ({ onExploreClick }) => {
  return (
    <section className="section-padding" style={{ 
      background: 'var(--gradient-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 25%),
                         radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.05) 0%, transparent 25%)`,
        pointerEvents: 'none'
      }} />
      
      <div className="container" style={{ position: 'relative' }}>
        <div className="grid-two-column">
          <div>
            <h1 className="hero-large" style={{ marginBottom: '24px' }}>
              Licores Premium para Conocedores Exigentes
            </h1>
            
            <p className="body-large" style={{ 
              marginBottom: '32px', 
              color: 'var(--text-light)',
              maxWidth: '480px',
              lineHeight: '1.8'
            }}>
              Descubre nuestra colección curada de los mejores whiskeys, vinos y champagnes del mundo. 
              Cada botella representa la excelencia y la tradición en destilación.
            </p>
            
            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--gold-primary)" />
                <span className="body-small" style={{ color: 'var(--text-light)' }}>
                  Productos Auténticos
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="var(--gold-primary)" />
                <span className="body-small" style={{ color: 'var(--text-light)' }}>
                  Compra Segura
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--gold-primary)" />
                <span className="body-small" style={{ color: 'var(--text-light)' }}>
                  Envío Rápido
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary"
                onClick={onExploreClick}
              >
                Explorar Colección
              </button>
              
              <button 
                className="btn-secondary" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}
              >
                Ver Ofertas Especiales
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3aGlza2V5fGVufDB8fHx8MTc1NzgzNTE2NXww&ixlib=rb-4.1.0&q=85"
                alt="Colección Premium de Licores"
                style={{
                  width: '100%',
                  maxWidth: '450px',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid var(--gold-primary)',
                  boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)'
                }}
              />
              
              {/* Floating Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--gradient-gold)',
                color: 'var(--bg-primary)',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)'
              }}>
                ✨ Premium
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};