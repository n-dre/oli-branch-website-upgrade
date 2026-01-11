import React, { useState } from 'react';
import { motion } from "framer-motion";
import { toast } from 'sonner';
import {
  Building2,
  Link as LinkIcon,
  Unlink,
  Shield,
  CheckCircle,
  RefreshCw,
  CreditCard,
  Wallet,
  Lock,
  AlertTriangle,
  Crown
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const MOCK_BANKS = [
  { id: 'chase', name: 'Chase', logo: '🏦', color: 'bg-blue-500' },
  { id: 'bofa', name: 'Bank of America', logo: '🏛️', color: 'bg-red-500' },
  { id: 'wells', name: 'Wells Fargo', logo: '🏪', color: 'bg-yellow-500' },
  { id: 'citi', name: 'Citibank', logo: '🏢', color: 'bg-blue-600' },
  { id: 'usbank', name: 'US Bank', logo: '🏦', color: 'bg-purple-500' },
  { id: 'pnc', name: 'PNC Bank', logo: '🏛️', color: 'bg-orange-500' },
  { id: 'capital', name: 'Capital One', logo: '💳', color: 'bg-red-600' },
  { id: 'td', name: 'TD Bank', logo: '🏪', color: 'bg-green-500' },
];

export default function BankLinking() {
  const { linkedBanks, linkBankAccount, unlinkBankAccount, subscription, feeAnalysis } = useData();
  const navigate = useNavigate();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [linkingStep, setLinkingStep] = useState('select'); // select, credentials, loading, success
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const isPremium = subscription.plan === 'premium';

  const handleSelectBank = (bank) => {
    if (!isPremium) {
      toast.error('Bank linking requires Premium subscription');
      navigate('/pricing');
      return;
    }
    setSelectedBank(bank);
    setLinkingStep('credentials');
  };

  const handleLink = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter your credentials');
      return;
    }
    
    setLinkingStep('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    linkBankAccount({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      accountType: 'Business Checking',
      accountMask: '****' + Math.floor(1000 + Math.random() * 9000),
      logo: selectedBank.logo
    });
    
    setLinkingStep('success');
    toast.success(`${selectedBank.name} linked successfully!`);
    
    setTimeout(() => {
      setShowLinkModal(false);
      setLinkingStep('select');
      setSelectedBank(null);
      setCredentials({ username: '', password: '' });
    }, 1500);
  };

  const handleUnlink = (bankId) => {
    if (window.confirm('Are you sure you want to unlink this account?')) {
      unlinkBankAccount(bankId);
      toast.success('Account unlinked');
    }
  };

  return (
    <DashboardLayout title="Link Bank Account" subtitle="Connect your bank to analyze fees and detect mismatches">
      <div className="space-y-6">
        {/* Premium Banner */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-accent bg-accent/5">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-accent" />
                    <div>
                      <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
                      <p className="text-sm text-muted-foreground">Bank linking and fee analysis requires Premium ($9.99/month)</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/pricing')} className="gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Linked Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Linked Accounts
                </CardTitle>
                <CardDescription>Your connected bank accounts for fee analysis</CardDescription>
              </div>
              <Button 
                onClick={() => setShowLinkModal(true)}
                disabled={!isPremium}
                className="gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Link New Account
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {linkedBanks.length > 0 ? (
              <div className="space-y-4">
                {linkedBanks.map((bank) => (
                  <div 
                    key={bank.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {bank.logo}
                      </div>
                      <div>
                        <h4 className="font-semibold">{bank.bankName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {bank.accountType} • {bank.accountMask}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleUnlink(bank.id)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold mb-2">No Accounts Linked</h3>
                <p className="text-muted-foreground mb-4">
                  Link your bank account to automatically detect fee mismatches
                </p>
                <Button 
                  onClick={() => setShowLinkModal(true)}
                  disabled={!isPremium}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link Your First Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fee Analysis Summary */}
        {feeAnalysis && linkedBanks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Fee Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Total Fees Found</p>
                    <p className="text-2xl font-bold text-destructive">${feeAnalysis.totalFees.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Avoidable Fees</p>
                    <p className="text-2xl font-bold text-warning">${feeAnalysis.avoidableFees.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-2xl font-bold text-success">${feeAnalysis.savingsPotential.toFixed(2)}/mo</p>
                  </div>
                </div>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => navigate('/fee-analysis')}
                >
                  View Detailed Fee Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security Info */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                <p className="text-sm text-muted-foreground">
                  We use 256-bit encryption and never store your login credentials. 
                  Your data is read-only - we can only view transactions, never move money.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Bank Modal */}
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {linkingStep === 'select' && 'Select Your Bank'}
              {linkingStep === 'credentials' && `Connect to ${selectedBank?.name}`}
              {linkingStep === 'loading' && 'Connecting...'}
              {linkingStep === 'success' && 'Success!'}
            </DialogTitle>
            <DialogDescription>
              {linkingStep === 'select' && 'Choose your bank to securely connect your account'}
              {linkingStep === 'credentials' && 'Enter your online banking credentials'}
              {linkingStep === 'loading' && 'Securely connecting to your bank...'}
              {linkingStep === 'success' && 'Your account has been linked successfully'}
            </DialogDescription>
          </DialogHeader>

          {linkingStep === 'select' && (
            <div className="grid grid-cols-2 gap-3 py-4">
              {MOCK_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleSelectBank(bank)}
                  className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <span className="text-2xl">{bank.logo}</span>
                  <p className="font-medium mt-2 text-sm">{bank.name}</p>
                </button>
              ))}
            </div>
          )}

          {linkingStep === 'credentials' && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-2xl">{selectedBank?.logo}</span>
                <span className="font-semibold">{selectedBank?.name}</span>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(c => ({ ...c, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(c => ({ ...c, password: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Your credentials are encrypted and never stored</span>
              </div>
            </div>
          )}

          {linkingStep === 'loading' && (
            <div className="py-12 text-center">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">Securely connecting to {selectedBank?.name}...</p>
            </div>
          )}

          {linkingStep === 'success' && (
            <div className="py-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
              <p className="font-semibold text-lg">Account Linked!</p>
              <p className="text-muted-foreground">Analyzing your transactions for fee mismatches...</p>
            </div>
          )}

          {(linkingStep === 'select' || linkingStep === 'credentials') && (
            <DialogFooter>
              {linkingStep === 'credentials' && (
                <>
                  <Button variant="outline" onClick={() => setLinkingStep('select')}>
                    Back
                  </Button>
                  <Button onClick={handleLink}>
                    Connect Account
                  </Button>
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
