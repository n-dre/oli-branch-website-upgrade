import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, use your real Stripe publishable key
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_demo_key';

// Create stripe promise but don't export it from this component file
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const StripeContext = createContext();

export function StripeProvider({ children }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Create checkout session (mock for demo, real implementation would call backend)
  const createCheckoutSession = async (_priceId, _successUrl, _cancelUrl) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // In production, this would call your backend to create a Stripe Checkout session
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId, successUrl, cancelUrl })
      // });
      // const session = await response.json();
      // return session;

      // Mock session for demo
      return {
        id: 'cs_demo_' + Date.now(),
        url: null, // We'll use embedded checkout instead
      };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process payment (mock for demo)
  const processPayment = async (_paymentDetails) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would:
      // 1. Create a PaymentIntent on your backend
      // 2. Confirm the payment with Stripe
      // 3. Handle the result

      // Mock successful payment
      return {
        success: true,
        paymentId: 'pi_demo_' + Date.now(),
        amount: 999, // $9.99 in cents
        currency: 'usd',
      };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Create subscription (mock for demo)
  const createSubscription = async (_customerId, _priceId) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        subscriptionId: 'sub_demo_' + Date.now(),
        status: 'active',
        currentPeriodEnd: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel subscription (mock for demo)
  const cancelSubscription = async (_subscriptionId) => {
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, status: 'canceled' };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StripeContext.Provider
      value={{
        stripe: stripePromise,
        isProcessing,
        paymentError,
        createCheckoutSession,
        processPayment,
        createSubscription,
        cancelSubscription,
        setPaymentError,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProvider');
  }
  return context;
}

// No other exports - this file only exports React components/hooks