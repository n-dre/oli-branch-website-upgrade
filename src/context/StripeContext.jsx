/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_demo_key';

// Create stripe promise (internal only, not exported)
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const StripeContext = createContext();

export function StripeProvider({ children }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const createCheckoutSession = async (_priceId, _successUrl, _cancelUrl) => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      return { id: 'cs_demo_' + Date.now(), url: null };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (_paymentDetails) => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      return {
        success: true,
        paymentId: 'pi_demo_' + Date.now(),
        amount: 999,
        currency: 'usd',
      };
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const createSubscription = async (_customerId, _priceId) => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
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

  const cancelSubscription = async (_subscriptionId) => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
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
