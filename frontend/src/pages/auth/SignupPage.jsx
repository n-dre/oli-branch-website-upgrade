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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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

      // Canonical: store auth + user id and move on
      localStorage.setItem("oliBranchToken", data.token);
      localStorage.setItem("oliBranchUserId", data.user_id);

      setSuccessMsg("Account created. Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 800);
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
      `}</style>

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
