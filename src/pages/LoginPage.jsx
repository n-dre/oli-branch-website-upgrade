// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const DASHBOARD_URL = "/dashboard";

  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  // --- UI State ---
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Message/Error State ---
  const [errors, setErrors] = useState({ email: '', password: '', login: '' });
  const [successMsg, setSuccessMsg] = useState('');

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors on input
    setErrors({ email: '', password: '', login: '' });
    setSuccessMsg('');
  };

  const validateInputs = () => {
    let ok = true;
    const newErrors = { email: '', password: '', login: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
      ok = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      ok = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      ok = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // Check localStorage for registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        // Store login state
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('isLoggedIn', 'true');
        storage.setItem('userEmail', formData.email);
        storage.setItem('userName', user.name || '');
        storage.setItem('userCompany', user.business_name || '');

        // Also set in localStorage for cross-tab sync
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', user.name || '');

        setSuccessMsg("Welcome back! Redirecting...");
        setTimeout(() => navigate(DASHBOARD_URL), 800);
      } else {
        setErrors(prev => ({ ...prev, login: "Invalid email or password. Please sign up if you don't have an account." }));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({ ...prev, login: "An error occurred. Please try again." }));
      setIsLoading(false);
    }
  };

  return (
    <div className="font-body bg-white" style={{ color: colors.charcoal }}>
      {/* CSS Styles */}
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #1B4332 100%); }
        .btn-primary { background: #1B4332; color: #fff; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .form-input { width: 100%; padding: 14px 18px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; transition: all 0.25s ease; background: #fff; }
        .form-input:focus { outline: none; border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1); }
        .password-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #6B7280; transition: color 0.2s ease; background: transparent; border: 0; padding: 8px; }
        .password-toggle:hover { color: #1B4332; }
        @media (max-width: 640px) { .form-input { padding: 12px 16px; } }
      `}</style>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex lg:w-2/5 hero-gradient flex-col justify-between p-8 xl:p-12 text-white relative">
          <div className="flex items-center">
            <Link to="/">
              <img src="/resources/oli-branch00.png" alt="Oli-Branch Logo" className="h-12 w-auto rounded-lg" />
            </Link>
          </div>

          <div className="space-y-6 mb-20">
            <h1 className="font-display text-4xl xl:text-5xl font-bold tracking-tight leading-tight uppercase">
              FIX YOUR<br />BANKING<br /><span style={{ color: colors.gold }}>MISMATCH</span>
            </h1>
            <p className="text-blue-100 text-base xl:text-lg max-w-md leading-relaxed">
              Identify hidden fees, account limits, and banking setups that don't match how your business actually operates—and get clear next steps.
            </p>
          </div>

          <div className="text-blue-200 text-xs xl:text-sm">
            <p>Copyright &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <Link to="/" className="inline-block">
                <img src="/resources/oli-branch00.png" alt="Oli-Branch" className="h-12 rounded-lg" />
              </Link>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: colors.charcoal }}>Welcome Back</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-500">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: colors.charcoal }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="text-red-500 text-sm mt-2">{errors.email}</div>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: colors.charcoal }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="form-input pr-12"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <div className="text-red-500 text-sm mt-2">{errors.password}</div>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe" 
                    className="mr-2 rounded border-gray-300"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-500">Remember me</span>
                </label>
                <Link to="/forgot-password" className="font-medium transition-colors" style={{ color: colors.forest }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 sm:py-4 px-6 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>

              {/* Error/Success Messages */}
              {errors.login && <div className="text-red-500 text-center text-sm mt-4">{errors.login}</div>}
              {successMsg && <div className="text-green-500 text-center text-sm mt-4">{successMsg}</div>}
            </form>

            {/* Sign Up Link */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <p className="text-center text-sm sm:text-base text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold" style={{ color: colors.forest }}>
                  Create Account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;