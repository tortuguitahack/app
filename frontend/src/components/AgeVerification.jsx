import React, { useState } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

export const AgeVerification = ({ isOpen, onVerify, onDeny }) => {
  const [selectedAge, setSelectedAge] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    if (selectedAge === 'yes') {
      onVerify();
    } else {
      onDeny();
    }
  };

  return (
    <div className="age-modal-overlay">
      <div className="age-modal-content">
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
          <Shield size={32} color="var(--bg-primary)" />
        </div>

        <h2 className="heading-1" style={{ 
          marginBottom: '16px',
          textAlign: 'center',
          color: 'var(--gold-primary)'
        }}>
          Verificación de Edad Requerida
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={16} color="var(--status-warning)" />
          <p className="body-small" style={{ color: 'var(--status-warning)' }}>
            Solo para mayores de edad
          </p>
        </div>
        
        <p className="body-large" style={{ 
          marginBottom: '32px', 
          color: 'var(--text-light)',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          Este sitio web contiene información sobre bebidas alcohólicas. 
          Debes ser mayor de 18 años para continuar navegando en Tambar Licorería.
        </p>
        
        <div style={{ marginBottom: '32px' }}>
          <p className="body-regular" style={{ 
            marginBottom: '20px',
            textAlign: 'center',
            color: 'var(--text-primary)',
            fontWeight: '500'
          }}>
            ¿Eres mayor de 18 años?
          </p>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            alignItems: 'center'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              padding: '12px 20px',
              border: `2px solid ${selectedAge === 'yes' ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
              borderRadius: '6px',
              background: selectedAge === 'yes' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}>
              <input
                type="radio"
                value="yes"
                checked={selectedAge === 'yes'}
                onChange={(e) => setSelectedAge(e.target.value)}
                style={{ 
                  accentColor: 'var(--gold-primary)',
                  transform: 'scale(1.2)'
                }}
              />
              <span className="body-regular" style={{ 
                color: selectedAge === 'yes' ? 'var(--gold-primary)' : 'var(--text-primary)'
              }}>
                Sí, soy mayor de 18 años
              </span>
            </label>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              padding: '12px 20px',
              border: `2px solid ${selectedAge === 'no' ? 'var(--status-error)' : 'var(--border-subtle)'}`,
              borderRadius: '6px',
              background: selectedAge === 'no' ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}>
              <input
                type="radio"
                value="no"
                checked={selectedAge === 'no'}
                onChange={(e) => setSelectedAge(e.target.value)}
                style={{ 
                  accentColor: 'var(--status-error)',
                  transform: 'scale(1.2)'
                }}
              />
              <span className="body-regular" style={{ 
                color: selectedAge === 'no' ? 'var(--status-error)' : 'var(--text-primary)'
              }}>
                No, soy menor de 18 años
              </span>
            </label>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleVerify}
            disabled={!selectedAge}
            style={{ 
              opacity: selectedAge ? 1 : 0.5,
              cursor: selectedAge ? 'pointer' : 'not-allowed',
              minWidth: '160px'
            }}
          >
            Continuar
          </button>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <p className="body-small" style={{ 
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            Al continuar, confirmas que tienes la edad legal para consumir alcohol en tu jurisdicción.
            <br />
            <strong style={{ color: 'var(--gold-primary)' }}>
              Tambar Licorería - Bebe con Responsabilidad
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};