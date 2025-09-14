import React, { useState } from 'react';

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
        <h2 className="heading-1" style={{ marginBottom: '24px' }}>Age Verification Required</h2>
        <p className="body-large" style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>
          This website contains information about alcoholic beverages. 
          You must be of legal drinking age to continue.
        </p>
        
        <div style={{ marginBottom: '32px' }}>
          <p className="body-regular" style={{ marginBottom: '16px' }}>
            Are you 21 years of age or older?
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="yes"
                checked={selectedAge === 'yes'}
                onChange={(e) => setSelectedAge(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <span className="body-regular">Yes, I am 21 or older</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="no"
                checked={selectedAge === 'no'}
                onChange={(e) => setSelectedAge(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <span className="body-regular">No, I am under 21</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleVerify}
            disabled={!selectedAge}
            style={{ 
              opacity: selectedAge ? 1 : 0.5,
              cursor: selectedAge ? 'pointer' : 'not-allowed'
            }}
          >
            Continue
          </button>
        </div>

        <p className="body-small" style={{ marginTop: '24px', color: 'var(--text-light)' }}>
          By continuing, you confirm that you are of legal drinking age in your jurisdiction.
        </p>
      </div>
    </div>
  );
};