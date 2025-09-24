import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle, Clock, CreditCard, Loader2 } from 'lucide-react';

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  orderData, 
  onPaymentSuccess 
}) => {
  const [paymentStep, setPaymentStep] = useState('qr'); // 'qr', 'processing', 'success'
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isOpen || paymentStep !== 'qr') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPaymentStep('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentStep]);

  if (!isOpen || !orderData) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSimulatePayment = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setPaymentStep('processing');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Call the payment success callback
      await onPaymentSuccess(orderData.orderId);
      
      setPaymentStep('success');
    } catch (error) {
      console.error('Payment simulation error:', error);
      setPaymentStep('qr');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClose = () => {
    if (paymentStep === 'success') {
      onPaymentSuccess(orderData.orderId);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(15px)'
    }}>
      <div style={{
        background: 'var(--gradient-card)',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        borderRadius: '12px',
        border: '2px solid var(--gold-primary)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <button
          onClick={handleClose}
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
          <X size={24} />
        </button>

        {/* QR Code Step */}
        {paymentStep === 'qr' && (
          <>
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
              <QrCode size={32} color="var(--bg-primary)" />
            </div>

            <h2 className="heading-2" style={{ 
              marginBottom: '16px',
              color: 'var(--gold-primary)'
            }}>
              Pagar con Código QR
            </h2>

            <p className="body-regular" style={{ 
              marginBottom: '24px',
              color: 'var(--text-muted)'
            }}>
              Escanea el código QR con tu app bancaria para completar el pago
            </p>

            {/* Order Details */}
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <h4 className="body-large" style={{ 
                marginBottom: '12px',
                color: 'var(--gold-primary)'
              }}>
                Detalles del Pedido
              </h4>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span className="body-small" style={{ color: 'var(--text-muted)' }}>
                  Pedido #
                </span>
                <span className="body-small" style={{ color: 'var(--text-primary)' }}>
                  {orderData.orderId}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span className="body-regular" style={{ color: 'var(--text-primary)' }}>
                  Total a pagar
                </span>
                <span className="heading-3" style={{ color: 'var(--gold-primary)' }}>
                  <span className="currency">Bs</span> {formatPrice(orderData.amount)}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'inline-block'
            }}>
              <img 
                src={orderData.qrCode} 
                alt="QR Code de Pago"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Countdown Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
              padding: '12px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '6px'
            }}>
              <Clock size={16} color="var(--gold-primary)" />
              <span className="body-small" style={{ color: 'var(--gold-primary)' }}>
                Expira en: {formatTime(countdown)}
              </span>
            </div>

            {/* Demo Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              {isSimulating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                '💳 Simular Pago (Demo)'
              )}
            </button>

            <p className="body-small" style={{ 
              marginTop: '12px',
              color: 'var(--text-muted)'
            }}>
              * Función de demostración para simular el pago
            </p>
          </>
        )}

        {/* Processing Step */}
        {paymentStep === 'processing' && (
          <>
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
              <Loader2 size={32} color="var(--bg-primary)" className="animate-spin" />
            </div>

            <h2 className="heading-2" style={{ 
              marginBottom: '16px',
              color: 'var(--gold-primary)'
            }}>
              Procesando Pago...
            </h2>

            <p className="body-regular" style={{ 
              color: 'var(--text-muted)'
            }}>
              Estamos verificando tu pago. Por favor espera un momento.
            </p>
          </>
        )}

        {/* Success Step */}
        {paymentStep === 'success' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--status-success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}>
              <CheckCircle size={32} color="var(--bg-primary)" />
            </div>

            <h2 className="heading-2" style={{ 
              marginBottom: '16px',
              color: 'var(--status-success)'
            }}>
              ¡Pago Exitoso!
            </h2>

            <p className="body-regular" style={{ 
              marginBottom: '24px',
              color: 'var(--text-muted)'
            }}>
              Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación pronto.
            </p>

            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p className="body-small" style={{ color: 'var(--gold-primary)' }}>
                Número de pedido: <strong>{orderData.orderId}</strong>
              </p>
            </div>

            <button
              onClick={handleClose}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Continuar Comprando
            </button>
          </>
        )}
      </div>
    </div>
  );
};