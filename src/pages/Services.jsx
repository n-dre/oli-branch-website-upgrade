import React, { useState, useEffect } from 'react';
import anime from 'animejs';

const ServicesPage = () => {
    const [activeTab, setActiveTab] = useState('banking');

    useEffect(() => {
        // Animation for elements with .fade-in-up class
        anime({
            targets: '.fade-in-up',
            opacity: 1,
            translateY: 0,
            duration: 800,
            easing: 'easeOutCubic',
            delay: anime.stagger(100)
        });

        // Animation for staggered children
        anime({
            targets: '.stagger-children > *',
            opacity: 1,
            translateY: 0,
            duration: 600,
            easing: 'easeOutCubic',
            delay: anime.stagger(100)
        });

        // Initialize Typed.js if needed
        if (window.Typed) {
            // Add typed.js initialization if you have typing animations
        }
    }, [activeTab]); // Re-run animations when tab changes to catch new elements

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const talkToOli = () => {
        alert("Oli AI Assistant - This would open the AI chat interface");
    };

    return (
        <>
            {/* CSS Injection - Preserving your exact styles */}
            <style>
                {`
                .hero-gradient {
                    background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
                }
                
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(248, 245, 240, 0.9);
                }
                
                .btn-primary {
                    background: #1B4332;
                    color: #F8F5F0;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    background: #52796F;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
                }
                
                .btn-secondary {
                    border: 2px solid #1B4332;
                    color: #1B4332;
                    background: transparent;
                    transition: all 0.3s ease;
                }
                
                .btn-secondary:hover {
                    background: #1B4332;
                    color: #F8F5F0;
                }
                
                .service-card {
                    transition: all 0.3s ease;
                    border: 1px solid rgba(82, 121, 111, 0.1);
                }
                
                .service-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
                
                .product-card {
                    transition: all 0.3s ease;
                    border: 1px solid rgba(82, 121, 111, 0.1);
                }
                
                .product-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                }
                
                .matcher-option {
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 1rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .matcher-option:hover {
                    border-color: #52796F;
                    background: rgba(82, 121, 111, 0.05);
                }
                
                .matcher-option.selected {
                    border-color: #52796F;
                    background: #52796F;
                    color: white;
                }
                
                .fade-in-up {
                    opacity: 0;
                    transform: translateY(24px);
                }
                
                .stagger-children > * {
                    opacity: 0;
                    transform: translateY(24px);
                }
                
                .tab-button {
                    padding: 12px 24px;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    background: transparent;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .tab-button.active {
                    border-color: #52796F;
                    background: #52796F;
                    color: white;
                }
                
                .tab-content {
                    display: none;
                }
                
                .tab-content.active {
                    display: block;
                }

                #oli-chat-trigger {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    cursor: pointer;
                    z-index: 1000;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
                    animation: vibrate-glow 2s infinite ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .oli-avatar-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid #FFD700;
                }

                @keyframes vibrate-glow {
                    0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
                    50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.4); }
                    100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
                }
                `}
            </style>

            <div className="font-body bg-cream text-charcoal">
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 glass-effect border-b border-sage/20">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <a href="/" className="flex items-center space-x-2">
                                <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden">
                                    <img src="resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-display font-bold text-xl text-forest">Oli-Branch</span>
                                    <span className="text-[10px] font-medium text-charcoal tracking-wide">Powered by AI</span>
                                </div>
                            </a>

                            <div className="hidden md:flex items-center space-x-8">
                                <a href="/" className="text-charcoal hover:text-sage transition-colors">Home</a>
                                <a href="/resources" className="text-charcoal hover:text-sage transition-colors">Resources</a>
                                <a href="/about" className="text-charcoal hover:text-sage transition-colors">About</a>
                                <a href="/login" className="text-charcoal hover:text-sage transition-colors">Login</a>
                                <a href="https://smartmatch-6.preview.emergentagent.com/" target="_blank" rel="noopener noreferrer"
                                    className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center">
                                    Free Audit
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-24 pb-16 bg-forest text-cream">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <div className="fade-in-up">
                            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                                Comprehensive <span className="text-gold">Financial Solutions</span>
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                                Oli is the AI auditor that finds the hidden fees and mismatched services draining your profit.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Service Tabs */}
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {['banking', 'health', 'resources', 'education'].map((tab) => (
                                <button 
                                    key={tab}
                                    type="button" 
                                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('banking', 'Banking Products').replace('health', 'Financial Health').replace('resources', 'Government Resources')}
                                </button>
                            ))}
                        </div>

                        <div className="tab-panels">
                            {/* Banking Products Tab */}
                            <div className={`tab-content ${activeTab === 'banking' ? 'active' : ''}`}>
                                <div className="mt-16">
                                    <h3 className="font-display text-3xl font-bold text-forest text-center mb-8">
                                        Banking Products That Reduce Financial Mismatch
                                    </h3>
                                    <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                                        These products are commonly recommended when a business is overpaying in fees...
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                                        {/* Card 1 */}
                                        <div className="product-card bg-white p-6 rounded-xl border">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-semibold text-forest">Business Checking</h4>
                                                <span className="text-gold font-bold">4.8/5</span>
                                            </div>
                                            <ul className="space-y-2 text-gray-600 mb-6">
                                                <li>✓ Designed for businesses overpaying monthly fees</li>
                                                <li>✓ Includes higher free transaction limits</li>
                                            </ul>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-forest mb-1">$0</div>
                                                <button type="button" className="btn-primary w-full py-3 rounded-lg">Review Options</button>
                                            </div>
                                        </div>
                                        {/* Additional cards follow same pattern... */}
                                    </div>
                                </div>
                            </div>

                            {/* Financial Health Tab */}
                            <div className={`tab-content ${activeTab === 'health' ? 'active' : ''}`}>
                                <div className="text-center mb-12 fade-in-up">
                                    <h2 className="font-display text-4xl font-bold text-forest mb-4">Financial Mismatch Dashboard</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 stagger-children">
                                        <div className="bg-white p-6 rounded-xl border">
                                            <h3 className="font-semibold text-forest mb-1">Mismatch Score</h3>
                                            <div className="text-4xl font-bold text-forest mb-2">68</div>
                                        </div>
                                        {/* Other Summary Cards... */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Floating AI Button */}
                <div id="oli-chat-trigger" onClick={talkToOli}>
                    <img src="resources/oli-branch00.png" alt="Oli AI" className="oli-avatar-img" />
                </div>
            </div>
        </>
    );
};

export default ServicesPage;