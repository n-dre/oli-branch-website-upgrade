// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  
  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  // --- State Management for Form Data ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    entityType: '',
    monthlyRevenue: '',
    accountType: '',
    monthlyBankingFees: '',
    zipCode: '',
    cashDeposits: false,
    fundingInterest: false,
    isVeteran: false,
    isImmigrant: false,
    agreeTerms: false,
  });

  // --- UI State ---
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Constants
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVja7KcSxwDAAuHnUmdBnPsdPDQe6cYAtxs10g8A7J5BbR0d0sze9h2AkH7QKLCoIG9g/exec";
  const LOGIN_URL = "/login";

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*]).{8,12}$/;

    if (!formData.fullName || formData.fullName.trim().split(/\s+/).length < 2) {
      newErrors.fullName = "Please enter both first and last name.";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!passRegex.test(formData.password)) {
      newErrors.password = "8-12 chars, 1 Upper, 1 Lower, 1 Number/Symbol.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.businessName) {
      newErrors.businessName = "Business name is required.";
    }
    if (!formData.entityType) {
      newErrors.entityType = "Select your entity type.";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const emailExists = existingUsers.some(u => u.email === formData.email);

      if (emailExists) {
        setErrors({ form: "An account with this email already exists. Please login instead." });
        setLoading(false);
        return;
      }

      // Create user payload
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        business_name: formData.businessName,
        entityType: formData.entityType,
        monthlyRevenue: formData.monthlyRevenue,
        accountType: formData.accountType,
        monthlyBankingFees: formData.monthlyBankingFees,
        zipCode: formData.zipCode,
        cashDeposits: formData.cashDeposits,
        fundingInterest: formData.fundingInterest,
        isVeteran: formData.isVeteran,
        isImmigrant: formData.isImmigrant,
        timestamp: new Date().toISOString()
      };

      // Try Google Apps Script integration (no-cors mode)
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "signup", ...payload })
        });
      } catch (err) {
        console.log('Google Script integration skipped:', err);
      }

      // Save to localStorage
      existingUsers.push(payload);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      localStorage.setItem('userEmail', formData.email);

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate(LOGIN_URL), 1500);

    } catch (err) {
      console.error('Signup error:', err);
      setErrors({ form: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="font-body bg-white min-h-screen flex flex-col lg:flex-row" style={{ color: colors.charcoal }}>
      {/* CSS Styles */}
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #1B4332 100%); }
        .glass-effect { backdrop-filter: blur(10px); background: rgba(255,255,255,.95); }
        .btn-primary { background: #1B4332; color: #fff; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 16px; transition: all 0.25s ease; background: #fff; }
        .form-input:focus { outline: none; border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1); }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-2/5 hero-gradient flex-col justify-between p-8 xl:p-12 text-white relative">
        <div className="flex items-center">
          <Link to="/">
            <img src="/resources/oli-branch00.png" alt="Oli-Branch Logo" className="h-12 w-auto rounded-lg" />
          </Link>
        </div>

        <div className="space-y-6 mb-20">
          <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight uppercase">
            FIX YOUR<br />FINANCIAL<br /><span style={{ color: colors.gold }}>MISMATCH</span>
          </h1>
          <p className="text-blue-100 text-base xl:text-lg max-w-md leading-relaxed">
            Create an account to identify hidden fees, account limits, and banking setups that don't match how your business actually operates.
          </p>
        </div>

        <div className="text-blue-200 text-xs xl:text-sm">
          <p>Copyright &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-4">
            <Link to="/">
              <img src="/resources/oli-branch00.png" alt="Oli-Branch" className="h-12 rounded-lg" />
            </Link>
          </div>

          {/* Back to Login Link */}
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-800 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: colors.charcoal }}>Create Account</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Start your financial journey with Oli-Branch</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Full Name *</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="Enter your full name" 
              />
              {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="Enter your email address" 
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="form-input pr-16" 
                  placeholder="8-12 chars, Upper, Lower, Symbol" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Confirm Password *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  className="form-input pr-16" 
                  placeholder="Confirm your password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 text-sm"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>

            {/* Business Details Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Business Name *</label>
                <input 
                  type="text" 
                  name="businessName" 
                  value={formData.businessName} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="Business name" 
                />
                {errors.businessName && <div className="text-red-500 text-xs mt-1">{errors.businessName}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Entity Type *</label>
                <select 
                  name="entityType" 
                  value={formData.entityType} 
                  onChange={handleInputChange} 
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="llc">LLC</option>
                  <option value="s_corp">S-Corp</option>
                  <option value="c_corp">C-Corp</option>
                  <option value="partnership">Partnership</option>
                  <option value="nonprofit">Nonprofit</option>
                </select>
                {errors.entityType && <div className="text-red-500 text-xs mt-1">{errors.entityType}</div>}
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Monthly Revenue</label>
                <input 
                  type="number" 
                  name="monthlyRevenue" 
                  value={formData.monthlyRevenue} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="$0" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Monthly Banking Fees</label>
                <input 
                  type="number" 
                  name="monthlyBankingFees" 
                  value={formData.monthlyBankingFees} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="$0" 
                  min="0"
                />
              </div>
            </div>

            {/* Account Type and ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>Account Type</label>
                <select 
                  name="accountType" 
                  value={formData.accountType} 
                  onChange={handleInputChange} 
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="checking">Business Checking</option>
                  <option value="savings">Business Savings</option>
                  <option value="both">Both</option>
                  <option value="none">No Business Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>ZIP Code</label>
                <input 
                  type="text" 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="12345" 
                  maxLength="5"
                />
              </div>
            </div>

            {/* Checkboxes Group */}
            <div className="space-y-2 py-2">
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  name="cashDeposits" 
                  id="cashDeposits" 
                  checked={formData.cashDeposits} 
                  onChange={handleInputChange} 
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: colors.forest }}
                />
                <label htmlFor="cashDeposits" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                  Do you regularly make cash deposits?
                </label>
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  name="fundingInterest" 
                  id="fundingInterest" 
                  checked={formData.fundingInterest} 
                  onChange={handleInputChange} 
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: colors.forest }}
                />
                <label htmlFor="fundingInterest" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                  Interested in business funding options?
                </label>
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  name="isVeteran" 
                  id="isVeteran" 
                  checked={formData.isVeteran} 
                  onChange={handleInputChange} 
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: colors.forest }}
                />
                <label htmlFor="isVeteran" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                  Veteran-owned business
                </label>
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  name="isImmigrant" 
                  id="isImmigrant" 
                  checked={formData.isImmigrant} 
                  onChange={handleInputChange} 
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: colors.forest }}
                />
                <label htmlFor="isImmigrant" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                  Immigrant founder
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
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
                I agree to the{' '}
                <Link to="/terms" className="hover:underline" style={{ color: colors.forest }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="hover:underline" style={{ color: colors.forest }}>Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && <div className="text-red-500 text-xs">{errors.agreeTerms}</div>}

            {/* Form Error */}
            {errors.form && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{errors.form}</div>}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full btn-primary py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2"
            >
              {loading && <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>

            {/* Success Message */}
            {successMsg && (
              <div className="text-green-600 text-center text-sm font-medium p-3 bg-green-50 rounded-lg">
                {successMsg}
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
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