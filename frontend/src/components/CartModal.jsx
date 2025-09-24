import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';

export const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (isProcessing || cart.items.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
      display: 'flex',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Cart Sidebar */}
      <div style={{
        width: '500px',
        maxWidth: '90vw',
        background: 'var(--gradient-card)',
        marginLeft: 'auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '2px solid var(--gold-primary)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingBag size={24} color="var(--gold-primary)" />
            <h2 className="heading-2" style={{ color: 'var(--gold-primary)' }}>
              Tu Carrito
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="nav-icon-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: cart.items.length > 0 ? '0' : '24px'
        }}>
          {cart.items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '80px'
            }}>
              <ShoppingBag size={48} color="var(--text-muted)" />
              <h3 className="heading-3" style={{ 
                marginTop: '16px', 
                marginBottom: '8px',
                color: 'var(--text-muted)'
              }}>
                Tu carrito está vacío
              </h3>
              <p className="body-regular" style={{ color: 'var(--text-muted)' }}>
                Agrega algunos productos premium para comenzar
              </p>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: '16px'
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  />

                  {/* Product Info */}
                  <div style={{ flex: 1 }}>
                    <h4 className="body-large" style={{ 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>
                      {item.name}
                    </h4>
                    
                    <p className="body-small" style={{ 
                      color: 'var(--gold-primary)',
                      marginBottom: '12px'
                    }}>
                      <span className="currency">Bs</span> {formatPrice(item.price)} c/u
                    </p>

                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-subtle)',
                        borderRadius: '4px',
                        padding: '4px'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold-primary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '2px'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        
                        <span style={{
                          minWidth: '24px',
                          textAlign: 'center',
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold-primary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '2px'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--status-error)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total and Actions */}
        {cart.items.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '2px solid var(--gold-primary)',
            background: 'var(--bg-subtle)'
          }}>
            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <p className="body-small" style={{ color: 'var(--text-muted)' }}>
                  {getTotalItems()} producto{getTotalItems() > 1 ? 's' : ''}
                </p>
                <h3 className="heading-2" style={{ 
                  color: 'var(--gold-primary)',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  <span className="currency">Bs</span> {formatPrice(calculateTotal())}
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn-primary"
                style={{ 
                  width: '100%',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Proceder al Pago
                  </>
                )}
              </button>
              
              <button
                onClick={onClearCart}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div 
        style={{ flex: 1 }}
        onClick={onClose}
      />
    </div>
  );
};