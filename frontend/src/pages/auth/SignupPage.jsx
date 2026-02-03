import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const colors = {
    gold: "#D4AF37",
    forest: "#1B4332",
    sage: "#52796F",
    cream: "#F8F5F0",
    charcoal: "#2D3748",
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    zipCode: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: "",
    saveCard: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*]).{8,12}$/;

    if (!formData.fullName || formData.fullName.trim().split(/\s+/).length < 2) {
      newErrors.fullName = "Please enter both first and last name.";
    }
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!passRegex.test(formData.password)) newErrors.password = "8-12 chars, 1 Upper, 1 Lower, 1 Number/Symbol.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.businessName) newErrors.businessName = "Business name is required.";
    if (!formData.businessType) newErrors.businessType = "Select your business type.";
    if (!formData.zipCode || String(formData.zipCode).trim().length < 5) newErrors.zipCode = "Enter a valid ZIP code.";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required.";
    }
    
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 15 || cardNumber.length > 19) {
      newErrors.cardNumber = "Please enter a valid card number.";
    }
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY).";
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = "Card has expired.";
      }
    }
    
    if (!paymentData.cvc || paymentData.cvc.length < 3 || paymentData.cvc.length > 4) {
      newErrors.cvc = "Please enter a valid CVC.";
    }
    
    if (!paymentData.zipCode || paymentData.zipCode.length < 5) {
      newErrors.zipCode = "Please enter a valid ZIP code.";
    }
    
    return newErrors;
  };

  const handlePaymentSubmit = async () => {
    const paymentErrors = validatePayment();
    if (Object.keys(paymentErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...paymentErrors }));
      return false;
    }

    try {
      const token = localStorage.getItem("oliBranchToken");
      if (!token) throw new Error("Authentication required");

      // Store payment info in user profile
      await fetch("/api/user/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...paymentData,
          isDefault: true,
          cardLastFour: paymentData.cardNumber.slice(-4),
          cardType: getCardType(paymentData.cardNumber)
        }),
      });

      setShowPaymentModal(false);
      navigate("/dashboard");
      return true;
    } catch (error) {
      console.error("Failed to save payment method:", error);
      setErrors((prev) => ({ ...prev, payment: "Failed to save payment method. Please try again." }));
      return false;
    }
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6(?:011|5)/.test(number)) return "Discover";
    return "Unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSuccessMsg("");

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        business_name: formData.businessName,
        business_type: formData.businessType,
        zip_code: formData.zipCode,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data?.detail || data?.error || "Signup failed." });
        setLoading(false);
        return;
      }

      // Store auth token and user id
      localStorage.setItem("oliBranchToken", data.token);
      localStorage.setItem("oliBranchUserId", data.user_id);

      setSuccessMsg("Account created successfully!");
      setLoading(false);
      
      // Show payment modal for 7-day trial
      setTimeout(() => {
        setShowPaymentModal(true);
      }, 500);
      
    } catch (err) {
      console.error(err);
      setErrors({ form: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="font-body bg-white min-h-screen flex flex-col lg:flex-row" style={{ color: colors.charcoal }}>
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #1B4332 100%); }
        .btn-primary { background: #1B4332; color: #fff; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 16px; transition: all 0.25s ease; background: #fff; }
        .form-input:focus { outline: none; border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1); }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Payment Modal Styles */
        .modal-overlay {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
          background: #F8F5F0;
          border: 2px solid #1B4332;
          box-shadow: 0 20px 60px rgba(27, 67, 50, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .secure-badge {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.2) 100%);
          border: 1px solid #D4AF37;
        }
      `}</style>

      {/* Payment Information Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 modal-overlay" 
            onClick={() => setShowPaymentModal(false)}
          />
          
          {/* Modal */}
          <div className="relative z-[101] w-full max-w-md modal-content rounded-2xl overflow-hidden">
            {/* Modal Header */}
            <div 
              className="px-6 py-5 text-white relative"
              style={{ backgroundColor: colors.forest }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Complete Your 7-Day Trial Setup</h2>
                  <p className="text-white/80 text-sm">Add payment information to start your free trial</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white text-xl"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Trial Reminder */}
              <div className="mb-6 p-3 rounded-lg border-2 border-yellow-500 bg-yellow-50">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    Your card will not be charged during the 7-day trial. After trial ends, you'll be charged $49/month unless cancelled.
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name on Card *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentInputChange}
                    className="form-input"
                    placeholder="Full name as shown on card"
                  />
                  {errors.cardName && <div className="text-red-500 text-xs mt-1">{errors.cardName}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formatCardNumber(paymentData.cardNumber)}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
                    }}
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.cardNumber && <div className="text-red-500 text-xs mt-1">{errors.cardNumber}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formatExpiryDate(paymentData.expiryDate)}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
                      }}
                      className="form-input"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && <div className="text-red-500 text-xs mt-1">{errors.expiryDate}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">CVC *</label>
                    <input
                      type="text"
                      name="cvc"
                      value={paymentData.cvc}
                      onChange={handlePaymentInputChange}
                      className="form-input"
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvc && <div className="text-red-500 text-xs mt-1">{errors.cvc}</div>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={paymentData.zipCode}
                    onChange={handlePaymentInputChange}
                    className="form-input"
                    placeholder="12345"
                    maxLength="10"
                  />
                  {errors.zipCode && <div className="text-red-500 text-xs mt-1">{errors.zipCode}</div>}
                </div>

                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    name="saveCard"
                    id="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handlePaymentInputChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: colors.forest }}
                  />
                  <label htmlFor="saveCard" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                    Save this card for future payments
                  </label>
                </div>

                {errors.payment && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{errors.payment}</div>}

                {/* Security Info */}
                <div className="p-3 rounded-lg secure-badge">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-yellow-700">
                      Your payment information is encrypted and secure. We use Stripe for payment processing.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-lg font-medium border-2 transition-colors flex-1"
                style={{ 
                  borderColor: colors.forest, 
                  color: colors.forest,
                  backgroundColor: 'transparent'
                }}
              >
                Skip for Now
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg flex-1 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: colors.forest,
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Complete Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-2/5 hero-gradient flex-col justify-between p-8 xl:p-12 text-white relative">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/oli-branch00.png" alt="Oli-Branch Logo" className="h-12 w-auto rounded-lg" />
          </Link>
        </div>

        <div className="space-y-6 mb-20">
          <div className="text-center">
            <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight uppercase">
              FIX YOUR BANKING<br /><span style={{ color: colors.gold }}>MISMATCH</span>
            </h1>
          </div>
          <div className="flex justify-center text-center">
            <p className="text-blue-100 text-base xl:text-lg max-w-md leading-relaxed mx-auto">
              Create an account to identify hidden fees, account limits, and banking setups that don't match how your business actually operates.
            </p>
          </div>
        </div>

        <div className="text-blue-200 text-xs xl:text-sm">
          <p> &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-4">
            <Link to="/">
              <img src="/images/oli-branch00.png" alt="Oli-Branch Logo" className="h-12 w-auto rounded-lg" />
            </Link>
          </div>

          {/* Back to Login */}
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-800 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: colors.forest}}>Welcome Back</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder="Enter your full name" />
              {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="Enter your email address" />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pr-16"
                  placeholder="8-12 chars, Upper, Lower, Symbol"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 text-sm">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input pr-16"
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 text-sm">
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Business Name *</label>
              <input name="businessName" value={formData.businessName} onChange={handleInputChange} className="form-input" placeholder="Business name" />
              {errors.businessName && <div className="text-red-500 text-xs mt-1">{errors.businessName}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Business Type *</label>
              <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="form-input">
                <option value="">Select</option>
                <option value="LLC">LLC</option>
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="S-Corp">S-Corp</option>
                <option value="C-Corp">C-Corp</option>
                <option value="Partnership">Partnership</option>
                <option value="Nonprofit">Nonprofit</option>
              </select>
              {errors.businessType && <div className="text-red-500 text-xs mt-1">{errors.businessType}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">ZIP Code *</label>
              <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="form-input" placeholder="12345" maxLength={10} />
              {errors.zipCode && <div className="text-red-500 text-xs mt-1">{errors.zipCode}</div>}
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-gray-300"
                style={{ accentColor: colors.forest }}
              />
              <label htmlFor="agreeTerms" className="ml-2.5 text-sm text-gray-500 cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="hover:underline" style={{ color: colors.forest }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="hover:underline" style={{ color: colors.forest }}>
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeTerms && <div className="text-red-500 text-xs">{errors.agreeTerms}</div>}

            {errors.form && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{errors.form}</div>}

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2">
              {loading && <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>

            {successMsg && <div className="text-green-600 text-center text-sm font-medium p-3 bg-green-50 rounded-lg">{successMsg}</div>}
          </form>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: colors.forest }}>
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;