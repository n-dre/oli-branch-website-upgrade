import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: '2 financial health checks per week', included: true },
        { text: 'Basic fee analysis', included: true },
        { text: 'Bank recommendations', included: true },
        { text: 'Email support', included: true },
        { text: 'Unlimited health checks', included: false },
        { text: 'Advanced analytics', included: false },
      ],
      buttonText: 'Current Plan',
      buttonBg: '#e0e0e0',
      buttonColor: '#666',
      popular: false
    },
    {
      name: 'Premium',
      description: 'For serious business owners',
      monthlyPrice: 49.99,
      yearlyPrice: 539.99,
      features: [
        { text: 'Unlimited financial health checks', included: true },
        { text: 'Advanced fee analysis', included: true },
        { text: 'Personalized recommendations', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Detailed analytics dashboard', included: true },
        { text: 'Export reports (PDF)', included: true },
      ],
      buttonText: 'Upgrade Now',
      buttonBg: '#1B4332',
      buttonColor: '#fff',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For teams and organizations',
      monthlyPrice: 79.99,
      yearlyPrice: 863.99,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      buttonText: 'Contact Sales',
      buttonBg: '#52796F',
      buttonColor: '#fff',
      popular: false
    }
  ];

  // Additional pricing options
  const additionalServices = [
    {
      name: 'Financial Leaks Report',
      description: 'One-time detailed report download',
      price: 29.99,
      isSubscription: false,
      frequency: 'One-time'
    },
    {
      name: 'Banking & Financial Leaks Access',
      description: 'Monthly subscription for banking links and financial leaks',
      price: 29.99,
      isSubscription: true,
      frequency: 'Monthly'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F5F0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      margin: 0,
      padding: 0
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '16px 32px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Link to="/" style={{ color: '#1B4332', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header style={{
        backgroundColor: '#1B4332',
        color: '#ffffff',
        padding: '60px 32px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '700',
          margin: '0 0 16px 0'
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </header>

      {/* Content */}
      <div style={{
        padding: '60px 32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Billing Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '48px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: billingCycle === 'monthly' ? '#1B4332' : '#e0e0e0',
              color: billingCycle === 'monthly' ? '#fff' : '#333',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (billingCycle !== 'monthly') {
                e.currentTarget.style.backgroundColor = '#d0d0d0';
              }
            }}
            onMouseLeave={(e) => {
              if (billingCycle !== 'monthly') {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: billingCycle === 'yearly' ? '#1B4332' : '#e0e0e0',
              color: billingCycle === 'yearly' ? '#fff' : '#333',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (billingCycle !== 'yearly') {
                e.currentTarget.style.backgroundColor = '#d0d0d0';
              }
            }}
            onMouseLeave={(e) => {
              if (billingCycle !== 'yearly') {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }
            }}
          >
            Yearly (Save 10%)
          </button>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: plan.popular ? '0 8px 40px rgba(27, 67, 50, 0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: plan.popular ? '2px solid #1B4332' : '2px solid #e0e0e0',
                position: 'relative',
                transform: plan.popular ? 'scale(1.02)' : 'none',
                transition: 'transform 0.3s ease'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1B4332',
                  color: '#fff',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  Most Popular
                </div>
              )}

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1B4332',
                marginTop: 0,
                marginBottom: '8px'
              }}>
                {plan.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '24px'
              }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#1B4332'
                }}>
                  ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span style={{
                  fontSize: '16px',
                  color: '#888'
                }}>
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '32px 0'
              }}>
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 0',
                      fontSize: '14px',
                      color: feature.included ? '#333' : '#999'
                    }}
                  >
                    <span style={{
                      color: feature.included ? '#22c55e' : '#ccc',
                      fontSize: '18px'
                    }}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button 
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: plan.buttonBg,
                  color: plan.buttonColor,
                  transition: 'all 0.2s ease',
                  opacity: plan.buttonText === 'Current Plan' ? 0.8 : 1
                }}
                onMouseEnter={(e) => {
                  if (plan.buttonText !== 'Current Plan') {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.buttonText !== 'Current Plan') {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
                disabled={plan.buttonText === 'Current Plan'}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div style={{
          marginTop: '80px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1B4332',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Additional Services
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {additionalServices.map((service, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.3s ease'
                }}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1B4332',
                  marginTop: 0,
                  marginBottom: '8px'
                }}>
                  {service.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '16px',
                  minHeight: '40px'
                }}>
                  {service.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginBottom: '24px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1B4332'
                  }}>
                    ${service.price}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#888',
                    marginLeft: '8px'
                  }}>
                    /{service.frequency}
                  </span>
                </div>
                
                <button 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: '#1B4332',
                    color: '#fff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#15382a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B4332';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Purchase Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Note about Premium Membership */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#f0f7f4',
          borderRadius: '12px',
          border: '1px solid #d4e6df'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1B4332',
            marginTop: 0,
            marginBottom: '8px'
          }}>
            Premium Membership Note:
          </h4>
          <p style={{
            fontSize: '14px',
            color: '#52796F',
            margin: 0
          }}>
            Our Premium plan at $49.99/month includes full access to all Oli-Branch features, 
            including financial leaks reports, banking links, and comprehensive financial analysis tools.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1B4332',
            marginBottom: '16px'
          }}>
            Questions?
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Contact us at support@oli-branch.com
          </p>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#1B4332',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#15382a';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1B4332';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}