import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
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

  // Constants preserved from original code
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
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,12}$).*/;

    if (!formData.fullName || formData.fullName.trim().split(/\s+/).length < 2) 
        newErrors.fullName = "Please enter both first and last name.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!passRegex.test(formData.password)) newErrors.password = "8-12 chars, 1 Upper, 1 Lower, 1 Number/Symbol.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.businessName) newErrors.businessName = "Business name is required.";
    if (!formData.entityType) newErrors.entityType = "Select your entity type.";
    if (!formData.monthlyRevenue || formData.monthlyRevenue < 0) newErrors.monthlyRevenue = "Enter your monthly revenue.";
    if (!formData.accountType) newErrors.accountType = "Select your account type.";
    if (!formData.monthlyBankingFees || formData.monthlyBankingFees < 0) newErrors.monthlyBankingFees = "Enter your monthly banking fees.";
    if (!/^\d{5}$/.test(formData.zipCode)) newErrors.zipCode = "Enter a valid 5-digit ZIP code.";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      action: "signup",
      ...formData,
      name: formData.fullName,
      business_name: formData.businessName,
      timestamp: new Date().toISOString()
    };

    try {
      // Use AuthContext register function
      const result = register(payload);
      
      if (result && !result.success) {
        setErrors({ form: result.message || "Registration failed" });
        setLoading(false);
        return;
      }

      // Google Apps Script integration (no-cors mode)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // LocalStorage backup logic
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      users.push(payload);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('userEmail', formData.email);

      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate(LOGIN_URL), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate(LOGIN_URL), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body bg-white text-charcoal min-h-screen flex flex-col lg:flex-row">
      {/* CSS Injection - Preserving your exact styles */}
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #1B4332 100%); }
        .glass-effect { backdrop-filter: blur(10px); background: rgba(255,255,255,.95); }
        .btn-primary { background: #1B4332; color: #fff; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 16px; transition: all 0.25s ease; background: #fff; }
        .form-input:focus { outline: none; border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1); }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-2/5 hero-gradient flex-col justify-between p-8 xl:p-12 text-white relative">
        <div className="flex items-center">
          <img src="/resources/OliGreen.jpeg" alt="Oli-Branch Logo" className="h-10 w-auto" />
        </div>
        <div className="space-y-6 mb-20">
          <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight uppercase">
            FIX YOUR<br />FINANCIAL<br />MISMATCH
          </h1>
          <p className="text-blue-100 text-base xl:text-lg max-w-md leading-relaxed">
            Create an account to identify hidden fees, account limits, and banking setups that don't match how your business actually operates.
          </p>
        </div>
        <div className="text-blue-200 text-xs xl:text-sm">
          Copyright © 2023–2026 Oli-Branch LLC. All Rights Reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          <div className="lg:hidden flex items-center justify-center mb-4">
            <img src="/resources/OliGreen.jpeg" alt="Oli-Branch" className="h-10 rounded-full" />
          </div>

          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1B4332] transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Login
          </Link>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Create Account</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Start your financial journey with Oli-Branch</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder="Enter your full name" />
              {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="Enter your email address" />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="form-input pr-12" 
                  placeholder="8-12 chars, Upper, Lower, Symbol" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B4332]">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  className="form-input pr-12" 
                  placeholder="Confirm your password" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B4332]">
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>

            {/* Business Details Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Business Name *</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="form-input" placeholder="Name" />
                {errors.businessName && <div className="text-red-500 text-xs mt-1">{errors.businessName}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Entity Type *</label>
                <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="form-input">
                  <option value="">Select</option>
                  <option value="llc">LLC</option>
                  <option value="s_corp">S-Corp</option>
                  <option value="c_corp">C-Corp</option>
                </select>
                {errors.entityType && <div className="text-red-500 text-xs mt-1">{errors.entityType}</div>}
              </div>
            </div>

            {/* Checkboxes Group */}
            <div className="space-y-2 py-2">
              {['cashDeposits', 'isVeteran', 'isImmigrant'].map((field) => (
                <div key={field} className="flex items-start">
                  <input type="checkbox" name={field} id={field} checked={formData[field]} onChange={handleInputChange} className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1B4332]" />
                  <label htmlFor={field} className="ml-2.5 text-sm text-gray-600">
                    {field === 'cashDeposits' ? 'Do you regularly make cash deposits?' : field === 'isVeteran' ? 'Veteran-owned business' : 'Immigrant founder'}
                  </label>
                </div>
              ))}
            </div>

            {/* Terms */}
            <div className="flex items-start pt-2">
              <input type="checkbox" name="agreeTerms" id="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="mt-1 h-4 w-4 rounded border-gray-300" />
              <label htmlFor="agreeTerms" className="ml-2.5 text-sm text-gray-500">
                I agree to the <Link to="/terms" className="text-[#1B4332] hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#1B4332] hover:underline">Privacy</Link>
              </label>
            </div>
            {errors.agreeTerms && <div className="text-red-500 text-xs">{errors.agreeTerms}</div>}
            {errors.form && <div className="text-red-500 text-sm text-center">{errors.form}</div>}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2">
              {loading && <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>

            {successMsg && <div className="text-green-600 text-center text-sm font-medium">{successMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;