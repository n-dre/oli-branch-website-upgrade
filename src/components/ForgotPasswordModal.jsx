import React, { useState } from 'react';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [captchaNumbers, setCaptchaNumbers] = useState({ a: 3, b: 7 });
  const [errors, setErrors] = useState({});
  const [maskedPhone, setMaskedPhone] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generate new captcha numbers
  const generateCaptcha = () => {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    const numA = (array[0] % 9) + 1;
    const numB = (array[1] % 9) + 1;
    setCaptchaNumbers({ a: numA, b: numB });
  };

  // Reset form
  const resetForm = () => {
    setStep(1);
    setEmail('');
    setPhone('');
    setCaptchaAnswer('');
    setVerificationCode('');
    setErrors({});
    setMaskedPhone('');
    generateCaptcha();
  };

  // Initialize on first open
  if (isOpen && !hasInitialized) {
    setHasInitialized(true);
    resetForm();
  }

  // Reset when modal closes
  if (!isOpen && hasInitialized) {
    setHasInitialized(false);
  }

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePhone = (phoneValue) => {
    return phoneValue.length === 10 && /^\d+$/.test(phoneValue);
  };

  const handleSendCode = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!captchaAnswer) {
      newErrors.captcha = 'Please solve the security question';
    } else if (parseInt(captchaAnswer, 10) !== captchaNumbers.a + captchaNumbers.b) {
      newErrors.captcha = 'Incorrect answer, please try again';
      generateCaptcha();
      setCaptchaAnswer('');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const masked = '******' + phone.slice(-4);
      setMaskedPhone(masked);
      setStep(2);
    }
  };

  const handleVerifyCode = () => {
    const newErrors = {};

    if (!verificationCode) {
      newErrors.code = 'Please enter the verification code';
    } else if (verificationCode.length !== 6) {
      newErrors.code = 'Code must be 6 digits';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Identity Verified! You can now reset your password.');
      onClose();
    }
  };

  const handleResendCode = () => {
    setVerificationCode('');
    setErrors({});
    alert('A new code has been sent to your phone.');
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleCodeInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  if (!isOpen) return null;

  // Styles
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      cursor: 'pointer',
    },
    modal: {
      position: 'relative',
      zIndex: 10,
      width: '95%',
      maxWidth: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    accentLine: {
      height: '4px',
      backgroundColor: '#1B4332',
    },
    content: {
      padding: '28px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1B4332',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#666666',
      marginTop: '6px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
      color: '#999999',
      fontSize: '28px',
      lineHeight: '1',
      borderRadius: '8px',
      transition: 'all 0.2s',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '700',
      color: '#1B4332',
      textTransform: 'uppercase',
      marginBottom: '8px',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '15px',
      backgroundColor: '#fafafa',
      color: '#333333',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#1B4332',
      backgroundColor: '#ffffff',
    },
    errorText: {
      fontSize: '12px',
      color: '#dc2626',
      marginTop: '6px',
      fontWeight: '500',
    },
    captchaBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid #e0e0e0',
    },
    captchaText: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1B4332',
    },
    captchaInput: {
      width: '80px',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '18px',
      backgroundColor: '#ffffff',
      color: '#333333',
      textAlign: 'center',
      fontWeight: '700',
      outline: 'none',
    },
    primaryBtn: {
      width: '100%',
      backgroundColor: '#1B4332',
      color: '#ffffff',
      padding: '16px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(27, 67, 50, 0.3)',
      transition: 'all 0.2s',
    },
    infoBox: {
      backgroundColor: '#e8f5e9',
      border: '1px solid #a5d6a7',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    infoText: {
      fontSize: '14px',
      color: '#2e7d32',
      margin: 0,
    },
    codeInput: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '28px',
      textAlign: 'center',
      letterSpacing: '0.5em',
      fontWeight: '700',
      backgroundColor: '#fafafa',
      color: '#333333',
      outline: 'none',
      boxSizing: 'border-box',
    },
    resendBtn: {
      background: 'none',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      color: '#52796F',
      textDecoration: 'underline',
      cursor: 'pointer',
      marginTop: '16px',
      padding: '8px',
    },
  };

  return (
    <div style={styles.overlay}>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Modal */}
      <div style={styles.modal}>
        <div style={styles.accentLine} />
        
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h3 style={styles.title}>Reset Password</h3>
              <p style={styles.subtitle}>Provide your registered details.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={styles.closeBtn}
              onMouseEnter={(e) => e.target.style.color = '#1B4332'}
              onMouseLeave={(e) => e.target.style.color = '#999999'}
            >
              ×
            </button>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="you@business.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1B4332';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneInput}
                  style={styles.input}
                  placeholder="Enter 10 digit number"
                  maxLength="10"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1B4332';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
                {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
              </div>

              {/* Captcha */}
              <div style={styles.captchaBox}>
                <span style={styles.captchaText}>
                  {captchaNumbers.a} + {captchaNumbers.b} = ?
                </span>
                <input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value.replace(/\D/g, ''))}
                  style={styles.captchaInput}
                  placeholder="?"
                  maxLength="2"
                  onFocus={(e) => e.target.style.borderColor = '#1B4332'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              {errors.captcha && <p style={{...styles.errorText, textAlign: 'center', marginTop: '-12px', marginBottom: '16px'}}>{errors.captcha}</p>}

              {/* Button */}
              <button
                type="button"
                onClick={handleSendCode}
                style={styles.primaryBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#52796F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B4332'}
              >
                Send Secure Code
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              {/* Info */}
              <div style={styles.infoBox}>
                <p style={styles.infoText}>
                  Enter the 6-digit code sent to <strong style={{ color: '#1B4332' }}>{maskedPhone}</strong>
                </p>
              </div>

              {/* Code Input */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeInput}
                  style={styles.codeInput}
                  placeholder="000000"
                  maxLength="6"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1B4332';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>
              {errors.code && <p style={{...styles.errorText, marginBottom: '16px'}}>{errors.code}</p>}

              {/* Buttons */}
              <button
                type="button"
                onClick={handleVerifyCode}
                style={styles.primaryBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#52796F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B4332'}
              >
                Verify & Reset
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                style={styles.resendBtn}
                onMouseEnter={(e) => e.target.style.color = '#1B4332'}
                onMouseLeave={(e) => e.target.style.color = '#52796F'}
              >
                Didn't receive code? Resend
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;