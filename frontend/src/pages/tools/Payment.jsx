// frontend/src/pages/tools/Payment.jsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Payment() {
  // Optional params:
  // /payment?type=subscription OR /payment?type=one_time
  // /payment?amount=29.99
  // /payment?plan=oli lite (optional for subscription)
  const q = useQuery();
  const type = q.get("type") === "one_time" ? "one_time" : "subscription";
  const planKey = (q.get("plan") || "oli lite").trim();
  const amountParam = q.get("amount");
  const amount = Number(amountParam);
  const displayAmount = Number.isFinite(amount) && amount > 0 ? amount : null;

  const [method, setMethod] = useState("card"); // card | bank | venmo | paypal | applepay
  const [submitting, setSubmitting] = useState(false);

  // UI-only state (Stripe handles real payment)
  const [card, setCard] = useState({ name: "", number: "", exp: "", cvc: "", zip: "" });
  const [bank, setBank] = useState({ name: "", routing: "", account: "" });

  const methodLabel = {
    card: "Credit / Debit Card",
    bank: "Bank Account (ACH)",
    venmo: "Venmo",
    paypal: "PayPal",
    applepay: "Apple Pay",
  };

  const isSubscription = type === "subscription";

  const startStripeCheckout = async () => {
    setSubmitting(true);
    try {
      const payload = isSubscription
        ? { type: "subscription", planKey }
        : { type: "one_time", amount: displayAmount || 0 };

      if (!isSubscription && !displayAmount) {
        toast.error("Missing or invalid one-time amount");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to start Stripe checkout");
        setSubmitting(false);
        return;
      }

      if (!data?.url) {
        toast.error("Stripe checkout URL missing");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      toast.error(e?.message || "Stripe checkout error");
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (method === "card") {
      if (!card.name || !card.number || !card.exp || !card.cvc) {
        toast.error("Please complete all card fields (UI only)");
        return;
      }
    }

    if (method === "bank") {
      if (!bank.name || !bank.routing || !bank.account) {
        toast.error("Please complete all bank fields (UI only)");
        return;
      }
    }

    await startStripeCheckout();
  };

  const methodCardClass = (key) =>
    `payment-option-card p-3 rounded-lg border text-left ${method === key ? "is-selected" : ""}`;

  return (
    <DashboardLayout
      title="Payments"
      subtitle="Manage payment methods for subscriptions and one-time purchases"
    >
      <div className="space-y-6">
        {/* Header bar */}
        <Card className="payment-method-card dark:border-emerald-800/40 dark:bg-gradient-to-br dark:from-emerald-950/20 dark:to-emerald-900/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mobile-stack">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 credit-card-icon dark:text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-gray-100">
                    {isSubscription ? "Subscription Payments" : "One-Time Payments"}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {isSubscription
                      ? "Choose a payment method for your subscription account."
                      : "Choose a payment method for one-time purchases."}
                    {displayAmount != null ? ` Amount: $${displayAmount.toFixed(2)}` : ""}
                  </p>
                  {isSubscription && (
                    <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                      Plan: <span className="font-medium dark:text-emerald-300">{planKey}</span>
                    </p>
                  )}
                </div>
              </div>

              <Link to="/settings?tab=payments" className="mobile-full">
                <Button variant="outline" className="gap-2 mobile-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Payment method selector */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Wallet className="h-5 w-5 wallet-lite dark:text-emerald-400" />
              Payment Methods Accepted
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              We accept credit/debit cards, bank account (ACH), Venmo, PayPal, and Apple Pay.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <button type="button" onClick={() => setMethod("card")} className={methodCardClass("card")} aria-pressed={method === "card"}>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 credit-card-icon dark:text-emerald-300" />
                  <span className="font-semibold text-sm dark:text-gray-100">Card</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Visa, Mastercard, AmEx</p>
              </button>

              <button type="button" onClick={() => setMethod("bank")} className={methodCardClass("bank")} aria-pressed={method === "bank"}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shield-forest dark:text-emerald-400" />
                  <span className="font-semibold text-sm dark:text-gray-100">Bank</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">ACH transfer</p>
              </button>

              <button type="button" onClick={() => setMethod("venmo")} className={methodCardClass("venmo")} aria-pressed={method === "venmo"}>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 wallet-lite dark:text-emerald-400" />
                  <span className="font-semibold text-sm dark:text-gray-100">Venmo</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Fast checkout</p>
              </button>

              <button type="button" onClick={() => setMethod("paypal")} className={methodCardClass("paypal")} aria-pressed={method === "paypal"}>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 wallet-lite dark:text-emerald-400" />
                  <span className="font-semibold text-sm dark:text-gray-100">PayPal</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">PayPal checkout</p>
              </button>

              <button type="button" onClick={() => setMethod("applepay")} className={methodCardClass("applepay")} aria-pressed={method === "applepay"}>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 shield-forest dark:text-emerald-400" />
                  <span className="font-semibold text-sm dark:text-gray-100">Apple Pay</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Tap to pay</p>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="tag-badge dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/40">
                Selected: {methodLabel[method]}
              </Badge>
              <Badge variant="outline" className="category-badge dark:bg-emerald-800/20 dark:text-emerald-300 dark:border-emerald-600/40">
                {isSubscription ? "Subscription" : "One-time"}
              </Badge>

              <span className="text-xs text-muted-foreground dark:text-gray-400 flex items-center gap-1 ml-auto">
                Powered by Stripe Checkout <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment details */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <ShieldCheck className="h-5 w-5 shield-forest dark:text-emerald-400" />
              Payment Details
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Your selection is saved for UX. Actual payment happens in Stripe Checkout after you continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {method === "card" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Name on card</label>
                      <Input 
                        value={card.name} 
                        onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} 
                        placeholder="Full name"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Card number</label>
                      <Input 
                        value={card.number} 
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))} 
                        placeholder="1234 5678 9012 3456"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Expiration</label>
                      <Input 
                        value={card.exp} 
                        onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))} 
                        placeholder="MM/YY"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">CVC</label>
                      <Input 
                        value={card.cvc} 
                        onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} 
                        placeholder="123"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">ZIP</label>
                      <Input 
                        value={card.zip} 
                        onChange={(e) => setCard((c) => ({ ...c, zip: e.target.value }))} 
                        placeholder="ZIP"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "bank" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Account holder</label>
                      <Input 
                        value={bank.name} 
                        onChange={(e) => setBank((b) => ({ ...b, name: e.target.value }))} 
                        placeholder="Name on bank account"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Routing number</label>
                      <Input 
                        value={bank.routing} 
                        onChange={(e) => setBank((b) => ({ ...b, routing: e.target.value }))} 
                        placeholder="9-digit routing"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Account number</label>
                      <Input 
                        value={bank.account} 
                        onChange={(e) => setBank((b) => ({ ...b, account: e.target.value }))} 
                        placeholder="Account number"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(method === "venmo" || method === "paypal" || method === "applepay") && (
                <div className="p-4 rounded-lg border border-border bg-card dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 wallet-lite dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-semibold dark:text-gray-100">
                        {method === "venmo" && "Venmo checkout is supported (via Stripe if enabled/available)."}
                        {method === "paypal" && "PayPal checkout is supported (via Stripe if enabled/available)."}
                        {method === "applepay" && "Apple Pay is supported (via Stripe when eligible)."}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        You'll confirm payment on the secure Stripe Checkout page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full credit-card-gradient dark:gradient-dark gap-2" 
                  disabled={submitting}
                >
                  <Lock className="h-4 w-4" />
                  {submitting ? "Redirecting..." : "Continue to Stripe Checkout"}
                </Button>

                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shield-forest dark:text-emerald-400" />
                  Payments are encrypted. We never store raw card details in the app.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .wallet-lite { color: #10B981 !important; }
        .shield-forest { color: #1B4332 !important; }

        /* Dark mode icon colors */
        .dark .wallet-lite { color: #10B981 !important; }
        .dark .shield-forest { color: #10B981 !important; }

        .credit-card-icon {
          color: #1B4332;
          transition: all 0.3s ease;
        }
        .dark .credit-card-icon {
          color: #10B981;
        }
        .credit-card-icon:hover {
          color: #52796F;
          transform: scale(1.1);
        }
        .dark .credit-card-icon:hover {
          color: #34D399;
        }

        .credit-card-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
          color: #F8F5F0 !important;
          transition: all 0.3s ease;
        }
        .credit-card-gradient:hover {
          background: linear-gradient(135deg, #52796F 0%, #1B4332 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }
        
        /* Dark mode gradient */
        .dark .credit-card-gradient {
          background: linear-gradient(135deg, #065F46 0%, #10B981 100%);
        }
        .dark .credit-card-gradient:hover {
          background: linear-gradient(135deg, #047857 0%, #34D399 100%) !important;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        }

        .payment-method-card {
          border: 2px solid #1B4332;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          transition: all 0.3s ease;
        }
        .payment-method-card:hover {
          border-color: #52796F;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.1) 0%, rgba(82, 121, 111, 0.1) 100%);
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.15);
        }

        .tag-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }
        .category-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }

        /* FIXED: Payment option cards with proper dark mode */
        .payment-option-card {
          border-color: rgba(0,0,0,0.12);
          background: #fff;
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease, background 0.16s ease;
          transform: translateY(0);
          box-shadow: none;
          outline: none;
        }
        .dark .payment-option-card {
          background: rgba(30, 41, 59, 0.5) !important;
          border-color: rgba(100, 116, 139, 0.3) !important;
          color: #e2e8f0;
        }
        
        .payment-option-card:hover {
          border-color: rgba(16, 185, 129, 0.65);
          background: rgba(16, 185, 129, 0.08);
          transform: translateY(-6px);
          box-shadow: 0 14px 26px rgba(16, 185, 129, 0.16);
        }
        .dark .payment-option-card:hover {
          border-color: rgba(16, 185, 129, 0.5) !important;
          background: rgba(16, 185, 129, 0.15) !important;
          box-shadow: 0 14px 26px rgba(16, 185, 129, 0.25);
        }
        
        .payment-option-card.is-selected {
          border-color: rgba(16, 185, 129, 0.85);
          background: #fff;
          transform: translateY(-6px);
          box-shadow: 0 14px 26px rgba(0,0,0,0.10);
        }
        .dark .payment-option-card.is-selected {
          border-color: rgba(16, 185, 129, 0.7) !important;
          background: rgba(16, 185, 129, 0.2) !important;
          box-shadow: 0 14px 26px rgba(16, 185, 129, 0.3);
        }
        
        .payment-option-card.is-selected:hover {
          background: rgba(16, 185, 129, 0.08);
          box-shadow: 0 14px 26px rgba(16, 185, 129, 0.16);
        }
        .dark .payment-option-card.is-selected:hover {
          background: rgba(16, 185, 129, 0.25) !important;
          box-shadow: 0 14px 26px rgba(16, 185, 129, 0.35);
        }
        
        .payment-option-card:active { transform: translateY(-4px); }
        
        .payment-option-card:focus-visible {
          border-color: rgba(16, 185, 129, 0.85);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.22), 0 14px 26px rgba(0,0,0,0.10);
        }
        .dark .payment-option-card:focus-visible {
          border-color: rgba(16, 185, 129, 0.7) !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3), 0 14px 26px rgba(16, 185, 129, 0.25);
        }

        @media (max-width: 640px) {
          .mobile-stack { flex-direction: column !important; }
          .mobile-full { width: 100% !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}