import React, { useState } from 'react';
import { Building2, CheckCircle, AlertCircle, Info, FileText, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const OrganizationSettings = () => {
  const [businessInfo, setBusinessInfo] = useState({
    legalName: '',
    dbaName: '',
    businessType: 'llc', // llc, corporation, sole-proprietorship, partnership
    industry: '',
    foundedYear: new Date().getFullYear(),
    website: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    legalName: false,
    dbaName: false,
  });

  // Validation rules
  const validateLegalName = (name) => {
    if (!name.trim()) return 'Legal business name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 100) return 'Name must be less than 100 characters';
    return '';
  };

  const validateDbaName = (name) => {
    if (name && name.length > 0) {
      if (name.length < 2) return 'DBA name must be at least 2 characters';
      if (name.length > 50) return 'DBA name must be less than 50 characters';
    }
    return '';
  };

  const legalNameError = validateLegalName(businessInfo.legalName);
  const dbaNameError = validateDbaName(businessInfo.dbaName);
  const isFormValid = !legalNameError && (!businessInfo.dbaName || !dbaNameError);

  const handleInputChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage or API
      localStorage.setItem('businessInfo', JSON.stringify(businessInfo));
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Business information saved successfully</span>
        </div>,
        { duration: 3000 }
      );
    } catch (error) {  // FIXED: Use the error variable
      console.error('Save failed:', error);
      toast.error(`Failed to save business information: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
    { value: 'llc', label: 'Limited Liability Company (LLC)' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'non-profit', label: 'Non-Profit Organization' },
  ];

  const industries = [
    'Technology',
    'Retail',
    'Healthcare',
    'Finance',
    'Real Estate',
    'Hospitality',
    'Manufacturing',
    'Professional Services',
    'Construction',
    'Education',
    'Other'
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Business Identity</h1>
            <p className="text-gray-600">Update your business name and registration details</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Business Setup Progress</span>
            <span className="font-medium">25%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Legal Business Name Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Legal Business Name
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your official registered business name as it appears on legal documents
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Required
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Legal Business Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={businessInfo.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                onBlur={() => handleBlur('legalName')}
                placeholder="e.g., Oli-Branch LLC"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  touched.legalName && legalNameError 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                required
              />
              {touched.legalName && legalNameError && (
                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{legalNameError}</span>
                </div>
              )}
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Info className="w-4 h-4" />
                <span>This should match your IRS registration and state filings</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Business Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('businessType', type.value)}
                    className={`px-3 py-2 text-sm border rounded-lg transition-all ${
                      businessInfo.businessType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DBA / Display Name Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">DBA / Display Name</h2>
              <p className="text-sm text-gray-600 mt-1">
                The name customers see when interacting with your business
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              Optional
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Doing Business As (DBA)
            </label>
            <input
              type="text"
              value={businessInfo.dbaName}
              onChange={(e) => handleInputChange('dbaName', e.target.value)}
              onBlur={() => handleBlur('dbaName')}
              placeholder="e.g., Oli-Branch"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                touched.dbaName && dbaNameError 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {touched.dbaName && dbaNameError && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{dbaNameError}</span>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              <p>• Commonly used for branding and marketing</p>
              <p>• May differ from your legal business name</p>
            </div>
          </div>
        </div>

        {/* Additional Business Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Industry
              </label>
              <select
                value={businessInfo.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Year Founded
              </label>
              <input
                type="number"
                value={businessInfo.foundedYear}
                onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={businessInfo.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Example Preview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Legal Name</div>
              <div className="text-lg font-semibold text-gray-900">
                {businessInfo.legalName || 'Your business name will appear here'}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Display Name</div>
              <div className="text-lg font-semibold text-blue-600">
                {businessInfo.dbaName || businessInfo.legalName || 'Your display name will appear here'}
              </div>
            </div>
            <div className="text-sm text-gray-500 italic">
              This is how your business name will appear to customers and in reports
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isSubmitting || !isFormValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Business Information
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              // Reset form
              setBusinessInfo({
                legalName: '',
                dbaName: '',
                businessType: 'llc',
                industry: '',
                foundedYear: new Date().getFullYear(),
                website: '',
              });
              setTouched({ legalName: false, dbaName: false });
              toast.success('Form cleared');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Need Help?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Legal Business Name:</strong> Should match your business registration documents</li>
              <li>• <strong>DBA Name:</strong> Used for branding and customer-facing communications</li>
              <li>• <strong>Business Type:</strong> Affects tax and liability considerations</li>
              <li>• Contact support if you need to update your legal business registration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;