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
  Leaf,
  Upload,
  Copy
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function Settings() {
  const { settings, updateSettings, paymentLinks, updatePaymentLinks, profileImage, updateProfileImage } = useData();
  const { theme, setTheme } = useTheme();
  
  const [profile, setProfile] = useState({
    companyName: settings.profile?.companyName || ''
  });
  
  const [gpsRadius, setGpsRadius] = useState([settings.gpsRadius || 3]);
  
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

  const handleSaveProfile = () => {
    updateSettings({ 
      profile: { ...settings.profile, companyName: profile.companyName }
    });
    toast.success('Profile settings saved!');
  };

  const handleSaveGPS = () => {
    updateSettings({ gpsRadius: gpsRadius[0] });
    toast.success(`GPS radius updated to ${gpsRadius[0]} miles`);
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved!');
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
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSavePayments = () => {
    updatePaymentLinks(payments);
    toast.success('Payment links saved!');
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

  const initials = (profile.companyName || 'U')
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Link */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard\" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Settings</span>
          </div>
        </div>

        <div className="border-b border-border mb-8" />

        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Profile Settings</h2>
        <p className="text-muted-foreground text-sm mb-6">Manage your account information and preferences</p>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
          </TabsList>

          <div className="border-b border-border mb-8" />

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="border-b border-dashed border-border">
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Avatar */}
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <button 
                      className="text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1 mx-auto"
                      onClick={() => document.getElementById('settingsAvatarInput')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload New Picture
                    </button>
                    <input
                      id="settingsAvatarInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            updateProfileImage(reader.result);
                            toast.success('Profile picture updated!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Company Name (shown in header)</Label>
                    <Input
                      placeholder="e.g., Your Company"
                      value={profile.companyName}
                      onChange={(e) => setProfile(p => ({ ...p, companyName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <Input value="Dec 2025" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>User ID</Label>
                      <Input value="USR-001234" disabled />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* GPS Settings */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    GPS Radius Settings
                  </CardTitle>
                  <CardDescription>
                    Set the search radius for finding nearby banks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Search Radius</Label>
                      <span className="text-2xl font-bold text-primary">
                        {gpsRadius[0]} miles
                      </span>
                    </div>
                    
                    <Slider
                      value={gpsRadius}
                      onValueChange={setGpsRadius}
                      min={1}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 mile</span>
                      <span>3 miles</span>
                      <span>5 miles</span>
                    </div>
                  </div>

                  {/* Visual Indicator */}
                  <div className="relative h-48 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                    <div 
                      className="absolute rounded-full border-2 border-primary/30 bg-primary/5 transition-all duration-500"
                      style={{ 
                        width: `${(gpsRadius[0] / 5) * 100}%`,
                        height: `${(gpsRadius[0] / 5) * 100}%`,
                        maxWidth: '90%',
                        maxHeight: '90%'
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Your Location</p>
                      <p className="text-xs text-muted-foreground">
                        {gpsRadius[0]} mile search radius
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Smaller radius = fewer but closer results</li>
                      <li>• Larger radius = more options but farther</li>
                      <li>• Default is 3 miles for optimal coverage</li>
                    </ul>
                  </div>

                  <Button onClick={handleSaveGPS} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save GPS Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="border-b border-dashed border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleChangePassword}>Update Password</Button>

                  <hr className="border-border" />

                  <h4 className="font-semibold text-sm">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Enable 2FA</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div>
                      <p className="font-medium text-destructive">Clear All Local Data</p>
                      <p className="text-sm text-muted-foreground">Remove all stored data from this browser</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleClearData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="border-b border-dashed border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                            theme === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <option.icon className={cn(
                            "h-8 w-8 mx-auto mb-2",
                            theme === option.value ? "text-primary" : "text-muted-foreground"
                          )} />
                          <p className="font-medium">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSaveAppearance} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Links</CardTitle>
                  <CardDescription>Stored locally in this browser. Hidden by default.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'cashApp', label: 'Cash App', placeholder: 'https://cash.app/$YourHandle' },
                    { key: 'zelle', label: 'Zelle', placeholder: 'Your Zelle email or phone' },
                    { key: 'venmo', label: 'Venmo', placeholder: 'https://venmo.com/u/YourHandle' },
                    { key: 'bankLink', label: 'Bank Account Link', placeholder: 'https://yourbank.com/pay/...' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showPaymentFields[field.key] ? 'text' : 'password'}
                          placeholder={field.placeholder}
                          value={payments[field.key]}
                          onChange={(e) => setPayments(p => ({ ...p, [field.key]: e.target.value }))}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePaymentVisibility(field.key)}
                        >
                          {showPaymentFields[field.key] ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSavePayments} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Payment Links
                    </Button>
                    <Button variant="outline" onClick={handleCopyPayments} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Links JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
