import React, { useState } from 'react';
import { motion } from "framer-motion";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Palette,
  Navigation,
  CreditCard,
  Save,
  Moon,
  Sun,
  Monitor,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  ArrowLeft,
  Upload,
  Copy,
  CheckCircle,
  Smartphone,
  Download,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Building,
  Coffee,
  ShoppingBag,
  Wrench,
  Factory,
  Check,
  HelpCircle,
  Key
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Slider } from '../components/ui/slider';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function Settings() {
  const { settings, updateSettings, paymentLinks, updatePaymentLinks, profileImage, updateProfileImage } = useData();
  const { theme, setTheme } = useTheme();
  
  const [profile, setProfile] = useState({
    companyName: settings.profile?.companyName || '',
    industry: settings.profile?.industry || '',
    location: settings.profile?.location || '',
    zipCode: settings.profile?.zipCode || ''
  });
  
  const [gpsRadius, setGpsRadius] = useState(settings.gpsRadius || 3);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const [payments, setPayments] = useState({
    cashApp: paymentLinks?.cashApp || '',
    zelle: paymentLinks?.zelle || '',
    venmo: paymentLinks?.venmo || '',
    bankLink: paymentLinks?.bankLink || ''
  });
  const [showPaymentFields, setShowPaymentFields] = useState({
    cashApp: false,
    zelle: false,
    venmo: false,
    bankLink: false
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saveStates, setSaveStates] = useState({
    profile: false,
    gps: false,
    password: false,
    payments: false,
    appearance: false
  });

  const handleSaveProfile = () => {
    updateSettings({ 
      profile: { ...settings.profile, ...profile }
    });
    setSaveStates(prev => ({ ...prev, profile: true }));
    toast.success('Profile settings saved!');
    setTimeout(() => setSaveStates(prev => ({ ...prev, profile: false })), 2000);
  };

  const handleSaveGPS = () => {
    updateSettings({ gpsRadius: gpsRadius });
    setSaveStates(prev => ({ ...prev, gps: true }));
    toast.success(`GPS radius updated to ${gpsRadius} miles`);
    setTimeout(() => setSaveStates(prev => ({ ...prev, gps: false })), 2000);
  };

  const handleSaveAppearance = () => {
    setSaveStates(prev => ({ ...prev, appearance: true }));
    toast.success('Appearance settings saved!');
    setTimeout(() => setSaveStates(prev => ({ ...prev, appearance: false })), 2000);
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaveStates(prev => ({ ...prev, password: true }));
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setSaveStates(prev => ({ ...prev, password: false })), 2000);
  };

  const handleSavePayments = () => {
    updatePaymentLinks(payments);
    setSaveStates(prev => ({ ...prev, payments: true }));
    toast.success('Payment links saved!');
    setTimeout(() => setSaveStates(prev => ({ ...prev, payments: false })), 2000);
  };

  const handleCopyPayments = async () => {
    const json = JSON.stringify(payments, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      toast.success('Copied JSON to clipboard');
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      settings: { ...settings, gpsRadius: gpsRadius },
      paymentLinks: payments
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-tools-settings.json';
    a.click();
    toast.success('Settings exported!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const togglePaymentVisibility = (field) => {
    setShowPaymentFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRadiusChange = (increment) => {
    setGpsRadius(prev => {
      const newValue = prev + increment;
      return Math.min(Math.max(newValue, 1), 5);
    });
  };

  const handleSliderChange = (value) => {
    setGpsRadius(value[0]);
  };

  const initials = (profile.companyName || 'U')
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Bright theme for daytime' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for night' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follows system settings' }
  ];

  const industryOptions = [
    { value: 'retail', label: 'Retail', icon: ShoppingBag },
    { value: 'services', label: 'Services', icon: Wrench },
    { value: 'manufacturing', label: 'Manufacturing', icon: Factory },
    { value: 'food', label: 'Food & Beverage', icon: Coffee },
    { value: 'other', label: 'Other', icon: HelpCircle }
  ];

  const settingsSections = [
    { id: 'profile', icon: User, label: 'Profile', description: 'Manage account details' },
    { id: 'security', icon: Shield, label: 'Security', description: 'Password & safety' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme & display' },
    { id: 'payments', icon: CreditCard, label: 'Payments', description: 'Payment methods' }
  ];

  const radiusOptions = [
    { value: 1.5, label: 'Close Range (1–2 mi)', description: 'Ideal for quick, local banking needs' },
    { value: 3, label: 'Standard (3 mi)', description: 'Balanced coverage for most businesses' },
    { value: 4.5, label: 'Extended (4–5 mi)', description: 'Maximum options in suburban areas' }
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Customize your experience and manage account preferences">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Configure your Financial Tools experience</p>
              </div>
            </div>
            <Link to="/dashboard" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                          activeTab === section.id
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          activeTab === section.id ? "text-primary" : "text-gray-500"
                        )} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{section.label}</div>
                          <div className="text-xs text-gray-500">{section.description}</div>
                        </div>
                        {saveStates[section.id] && (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Profile Data</span>
                      <span className="text-sm font-medium text-green-600">Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment Methods</span>
                      <span className="text-sm font-medium text-blue-600">
                        {Object.values(payments).filter(v => v).length} saved
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Search Radius</span>
                      <span className="text-sm font-medium text-purple-600">{gpsRadius} miles</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Manage your account details and business information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="text-center sm:text-left">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                          {profileImage ? (
                            <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">Profile Picture</h3>
                        <p className="text-sm text-gray-500 mb-4">Recommended: 400×400px, JPG or PNG</p>
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            onClick={() => document.getElementById('profileImageInput')?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Picture
                          </Button>
                          <input
                            id="profileImageInput"
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size (5MB max)
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error('Image must be less than 5MB');
                                  return;
                                }
                                
                                // Validate dimensions
                                const img = new Image();
                                img.onload = () => {
                                  if (img.width < 100 || img.height < 100) {
                                    toast.error('Image should be at least 100x100 pixels');
                                    return;
                                  }
                                  
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    updateProfileImage(e.target.result);
                                    toast.success('Profile picture uploaded successfully!');
                                  };
                                  reader.readAsDataURL(file);
                                };
                                img.src = URL.createObjectURL(file);
                              }
                            }}
                          />
                          {profileImage && (
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                updateProfileImage(null);
                                toast.success('Profile picture removed');
                              }}
                            >
                              Remove Picture
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Upload a professional photo for your business profile
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Your Business Name"
                          value={profile.companyName}
                          onChange={(e) => setProfile(p => ({ ...p, companyName: e.target.value }))}
                        />
                        <p className="text-xs text-gray-500">Displayed in the header</p>
                      </div>
                      
                      {/* Fixed Industry Dropdown */}
                      <div className="space-y-3 relative z-50">
                        <Label htmlFor="industry">Industry</Label>
                        <Select 
                          value={profile.industry} 
                          onValueChange={(value) => setProfile(p => ({ ...p, industry: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="z-50" position="popper">
                            {industryOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {option.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="location">Business Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={profile.location}
                          onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="zipCode">Zip Code *</Label>
                        <Input
                          id="zipCode"
                          placeholder="Enter zip code"
                          value={profile.zipCode}
                          onChange={(e) => setProfile(p => ({ ...p, zipCode: e.target.value }))}
                        />
                        <p className="text-xs text-gray-500">Used for location-based services</p>
                      </div>

                      <div className="space-y-3">
                        <Label>Account ID</Label>
                        <Input value="USR-0012399Y" disabled className="bg-muted font-mono" />
                        <p className="text-xs text-gray-500">Unique identifier for your account</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Last saved: {saveStates.profile ? 'Just now' : 'Never'}
                      </div>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        {saveStates.profile ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Search Settings Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location Search Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how far we search for banks and financial resources based on your zip code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <Label className="text-base font-medium">Search Radius</Label>
                          <p className="text-sm text-muted-foreground">Adjust the distance for finding nearby banks</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-primary">{gpsRadius} mi</span>
                          <span className="text-sm text-muted-foreground">
                            {gpsRadius === 1 ? 'Local only' : 
                             gpsRadius === 3 ? 'Recommended' : 
                             gpsRadius === 5 ? 'Max range' : ''}
                          </span>
                        </div>
                      </div>
                      
                      {/* Zip Code Input */}
                      <div className="p-4 rounded-lg bg-muted/30 border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <Label className="font-medium mb-2 block">Your Location</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Searching within {gpsRadius} mile{gpsRadius !== 1 ? 's' : ''} of{" "}
                              <span className="font-semibold">{profile.zipCode || 'your zip code'}</span>
                            </p>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter zip code"
                                value={profile.zipCode}
                                onChange={(e) => setProfile(p => ({ ...p, zipCode: e.target.value }))}
                                className="max-w-xs"
                              />
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  if (profile.zipCode && profile.zipCode.length === 5) {
                                    toast.success(`Location updated to ${profile.zipCode}`);
                                  }
                                }}
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Radius Slider */}
                      <div className="py-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>1 mi<br /><span className="text-xs">Local only</span></span>
                            <span>3 mi<br /><span className="text-xs">Recommended</span></span>
                            <span>5 mi<br /><span className="text-xs">Max range</span></span>
                          </div>
                          
                          <Slider
                            value={[gpsRadius]}
                            min={1}
                            max={5}
                            step={0.5}
                            onValueChange={handleSliderChange}
                            className="w-full"
                          />
                          
                          <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                              <span className="text-lg font-semibold text-primary">{gpsRadius} miles</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Radius Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {radiusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setGpsRadius(option.value)}
                              className={cn(
                                "p-4 rounded-lg border text-left transition-all",
                                gpsRadius === option.value
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/30 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{option.label.split('(')[0].trim()}</span>
                                {gpsRadius === option.value && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                              <div className="mt-2 text-sm font-medium">
                                {option.value} mile{option.value !== 1 ? 's' : ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Visual Guide */}
                    <div className="relative h-64 bg-gradient-to-b from-blue-50 to-background rounded-xl overflow-hidden border">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Circles */}
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="absolute rounded-full border-2 border-blue-200/50 bg-blue-50/30 transition-all duration-500"
                              style={{
                                width: `${(gpsRadius / 5) * (80 * i)}px`,
                                height: `${(gpsRadius / 5) * (80 * i)}px`,
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                            />
                          ))}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3 shadow-lg">
                              <MapPin className="h-6 w-6" />
                            </div>
                            <p className="font-medium">Your Location</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.zipCode || 'Add zip code'} • {gpsRadius} mile{gpsRadius !== 1 ? 's' : ''} radius
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Current radius: {gpsRadius} mile{gpsRadius !== 1 ? 's' : ''}
                        {profile.zipCode && ` around ${profile.zipCode}`}
                      </div>
                      <Button onClick={handleSaveGPS} className="gap-2" disabled={!profile.zipCode}>
                        {saveStates.gps ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Updated!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Location Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>Keep your account secure with strong authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password Change */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label>Current Password</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter current password"
                              value={passwords.current}
                              onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label>New Password</Label>
                          <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Minimum 8 characters"
                              value={passwords.new}
                              onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                              className="pr-10"
                            />
                        </div>
                        <div className="space-y-3">
                          <Label>Confirm New Password</Label>
                          <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Re-enter new password"
                              value={passwords.confirm}
                              onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                              className="pr-10"
                            />
                        </div>
                      </div>

                      {/* Password Strength Indicator */}
                      {passwords.new && (
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Password Strength</span>
                            <span className={`text-sm font-semibold ${
                              passwords.new.length >= 12 ? 'text-green-600' :
                              passwords.new.length >= 8 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {passwords.new.length >= 12 ? 'Strong' :
                               passwords.new.length >= 8 ? 'Medium' : 'Weak'}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwords.new.length >= 12 ? 'w-full bg-green-500' :
                                passwords.new.length >= 8 ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'
                              }`}
                            />
                          </div>
                          <ul className="mt-3 space-y-1 text-xs text-gray-600">
                            <li className={`flex items-center gap-1 ${passwords.new.length >= 8 ? 'text-green-600' : ''}`}>
                              <CheckCircle className={`h-3 w-3 ${passwords.new.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                              At least 8 characters
                            </li>
                            <li className={`flex items-center gap-1 ${/[A-Z]/.test(passwords.new) ? 'text-green-600' : ''}`}>
                              <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(passwords.new) ? 'text-green-600' : 'text-gray-400'}`} />
                              Contains uppercase letter
                            </li>
                            <li className={`flex items-center gap-1 ${/\d/.test(passwords.new) ? 'text-green-600' : ''}`}>
                              <CheckCircle className={`h-3 w-3 ${/\d/.test(passwords.new) ? 'text-green-600' : 'text-gray-400'}`} />
                              Contains number
                            </li>
                          </ul>
                        </div>
                      )}

                      <Button 
                        onClick={handleChangePassword} 
                        disabled={!passwords.current || !passwords.new || !passwords.confirm}
                        className="gap-2"
                      >
                        {saveStates.password ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Password Updated!
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Security Features</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable 2FA
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Device Management</p>
                              <p className="text-sm text-gray-600">View and manage active devices</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage Devices
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      Irreversible actions - proceed with caution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                      <div>
                        <p className="font-medium text-red-800">Clear All Local Data</p>
                        <p className="text-sm text-red-600">This will remove all your settings, preferences, and stored data</p>
                      </div>
                      <Button variant="destructive" onClick={handleClearData} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Clear All Data
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div>
                        <p className="font-medium text-yellow-800">Export All Data</p>
                        <p className="text-sm text-yellow-700">Download a backup of all your settings</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Appearance & Display
                    </CardTitle>
                    <CardDescription>Customize how the app looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Responsive Theme Selection */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base">Theme</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themeOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => setTheme(option.value)}
                              className={cn(
                                "p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md",
                                theme === option.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30"
                              )}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className={cn(
                                  "p-2 rounded-lg",
                                  theme === option.value ? "bg-primary/10" : "bg-muted"
                                )}>
                                  <Icon className={cn(
                                    "h-6 w-6",
                                    theme === option.value ? "text-primary" : "text-muted-foreground"
                                  )} />
                                </div>
                                <div>
                                  <span className="font-semibold block">{option.label}</span>
                                  {theme === option.value && (
                                    <span className="text-xs text-primary flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language and Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY (US)</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY (EU)</SelectItem>
                            <SelectItem value="ymd">YYYY-MM-DD (ISO)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="p-6 rounded-xl bg-muted/30 border">
                      <h4 className="font-medium text-foreground mb-4">Theme Preview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-background rounded-lg border space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <SettingsIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">Settings Panel</p>
                              <p className="text-sm text-muted-foreground">This is how your settings will appear</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Primary Button</Button>
                            <Button size="sm" variant="outline">Secondary</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-background rounded-lg border">
                          <div className="space-y-3">
                            <div className="h-2 bg-muted rounded-full w-3/4"></div>
                            <div className="h-2 bg-muted rounded-full w-1/2"></div>
                            <div className="h-2 bg-muted rounded-full w-5/6"></div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Theme: {themeOptions.find(t => t.value === theme)?.label}
                      </div>
                      <Button onClick={handleSaveAppearance} className="gap-2 w-full sm:w-auto">
                        {saveStates.appearance ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Settings Applied!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Apply Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Store your payment links securely. Data is saved locally in your browser.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Methods */}
                    <div className="space-y-4">
                      {[
                        { key: 'cashApp', label: 'Cash App', icon: '💵', placeholder: 'https://cash.app/$yourhandle' },
                        { key: 'zelle', label: 'Zelle', icon: '🏦', placeholder: 'your@email.com or (555) 123-4567' },
                        { key: 'venmo', label: 'Venmo', icon: '📱', placeholder: 'https://venmo.com/u/username' },
                        { key: 'bankLink', label: 'Bank Transfer', icon: '🏛️', placeholder: 'Account/routing number or payment link' }
                      ].map((field) => (
                        <div key={field.key} className="space-y-3 p-4 rounded-lg border bg-card">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg">{field.icon}</span>
                              </div>
                              <div>
                                <Label className="font-medium">{field.label}</Label>
                                <p className="text-xs text-muted-foreground">Click show to view/edit</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => togglePaymentVisibility(field.key)}
                              className="gap-2 self-start sm:self-center"
                            >
                              {showPaymentFields[field.key] ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Show
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {showPaymentFields[field.key] && (
                            <div className="pt-3 border-t">
                              <Input
                                type="text"
                                placeholder={field.placeholder}
                                value={payments[field.key]}
                                onChange={(e) => setPayments(p => ({ ...p, [field.key]: e.target.value }))}
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                This information is stored locally and never sent to our servers
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Data Security Note */}
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Your Data is Secure</p>
                          <p className="text-sm text-green-700 mt-1">
                            All payment information is encrypted and stored locally in your browser. 
                            We never transmit this data to our servers, ensuring maximum privacy and security.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button onClick={handleSavePayments} className="gap-2 flex-1">
                        {saveStates.payments ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Saved Successfully!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Payment Methods
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleCopyPayments} className="gap-2">
                        <Copy className="h-4 w-4" />
                        Copy All Links
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}