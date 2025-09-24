import React, { useState } from 'react';
import { X, User, Lock, Loader2 } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLogin, user }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await onLogin(credentials);
    } catch (error) {
      setError('Credenciales incorrectas. Usuario: tambar, Contraseña: tambar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.reload();
  };

  if (user) {
    // User is logged in - show user profile
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'var(--gradient-card)',
          padding: '48px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          borderRadius: '8px',
          border: '2px solid var(--gold-primary)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={20} />
          </button>

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
            <User size={32} color="var(--bg-primary)" />
          </div>

          <h2 className="heading-2" style={{ 
            marginBottom: '16px',
            color: 'var(--gold-primary)'
          }}>
            ¡Bienvenido!
          </h2>

          <p className="body-regular" style={{ 
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            {user.name}
          </p>

          <p className="body-small" style={{ 
            marginBottom: '32px',
            color: 'var(--text-muted)',
            textTransform: 'capitalize'
          }}>
            {user.role} • Tambar Licorería
          </p>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'var(--gradient-card)',
        padding: '48px',
        maxWidth: '400px',
        width: '90%',
        borderRadius: '8px',
        border: '2px solid var(--gold-primary)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--gradient-gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <User size={24} color="var(--bg-primary)" />
          </div>
          
          <h2 className="heading-2" style={{ 
            marginBottom: '8px',
            color: 'var(--gold-primary)'
          }}>
            Iniciar Sesión
          </h2>
          <p className="body-regular" style={{ color: 'var(--text-muted)' }}>
            Accede a tu cuenta de Tambar Licorería
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Usuario"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid var(--status-error)',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p className="body-small" style={{ color: 'var(--status-error)' }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ 
              width: '100%',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          <p className="body-small" style={{ color: 'var(--gold-primary)', marginBottom: '4px' }}>
            Credenciales de prueba:
          </p>
          <p className="body-small" style={{ color: 'var(--text-muted)' }}>
            Usuario: <strong>tambar</strong> | Contraseña: <strong>tambar</strong>
          </p>
        </div>
      </div>
    </div>
  );
};