import React, { useEffect, useState } from 'react';

const About = () => {
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [auditProgress, setAuditProgress] = useState(0);
    const [auditStep, setAuditStep] = useState(1);
    const [monthlyFee, setMonthlyFee] = useState('');
    const [auditResult, setAuditResult] = useState('');

    useEffect(() => {
        // Animate statistics numbers
        const animateNumbers = () => {
            const statNumbers = document.querySelectorAll('.stat-number');
            
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.dataset.target);
                        animateNumber(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            statNumbers.forEach(stat => {
                observer.observe(stat);
            });
            
            function animateNumber(element, target) {
                if (window.anime) {
                    window.anime({
                        targets: { value: 0 },
                        value: target,
                        duration: 2000,
                        easing: 'easeOutQuad',
                        update: function(anim) {
                            element.textContent = Math.floor(anim.animatables[0].target.value);
                        }
                    });
                } else {
                    // Fallback if anime.js is not available
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            element.textContent = target;
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current);
                        }
                    }, 40);
                }
            }
        };

        // Initialize animations
        const initAnimations = () => {
            const fadeInElements = document.querySelectorAll('.fade-in-up');
            const staggerChildren = document.querySelectorAll('.stagger-children > *');

            // Simple fade in animation
            const fadeIn = () => {
                fadeInElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                });
            };

            // Stagger animation for children
            const staggerAnimation = () => {
                staggerChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }, index * 100);
                });
            };

            // Execute animations
            setTimeout(() => {
                fadeIn();
                staggerAnimation();
            }, 100);
        };

        animateNumbers();
        initAnimations();
    }, []);

    const talkToOli = () => {
        alert("Hi! I'm Oli. I'm currently analyzing account mismatches. How can I help you?");
    };

    const startAudit = () => {
        setShowAuditModal(true);
        setAuditProgress(0);
        setAuditStep(1);
        setAuditResult('');
        setMonthlyFee('');
    };

    const closeAudit = () => {
        setShowAuditModal(false);
    };

    const processAudit = () => {
        const feeValue = parseFloat(monthlyFee) || 0;
        
        // Animate progress bar
        setAuditProgress(100);
        
        // Show result after delay
        setTimeout(() => {
            setAuditStep(2);
            
            if (feeValue > 100) {
                setAuditResult(`We found potential savings of $${(feeValue * 0.3).toFixed(2)} per month. That's $${(feeValue * 0.3 * 12).toFixed(2)} per year you could be saving!`);
            } else if (feeValue > 50) {
                setAuditResult(`We identified $${(feeValue * 0.2).toFixed(2)} in potentially unnecessary fees each month. Let's help you optimize!`);
            } else {
                setAuditResult(`Your fees look reasonable, but we can still help you find better banking options that match your business needs.`);
            }
        }, 1000);
    };

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && showAuditModal) {
                closeAudit();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showAuditModal]);

    return (
        <div className="font-body bg-cream text-charcoal">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-effect border-b border-sage/20">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* LOGO */}
                        <a href="/" className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden">
                                <img
                                    src="resources/oli-branch00.png"
                                    alt="Oli Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-display font-bold text-xl text-forest">
                                    Oli-Branch
                                </span>
                                <span className="text-[10px] font-medium text-charcoal tracking-wide">
                                    Powered by AI
                                </span>
                            </div>
                        </a>

                        {/* NAV LINKS */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="/services" className="text-charcoal hover:text-sage transition-colors">Services</a>
                            <a href="/resources" className="text-charcoal hover:text-sage transition-colors">Resources</a>
                            <a href="/about" className="text-charcoal hover:text-sage transition-colors">About</a>
                            <a href="/login" className="text-charcoal hover:text-sage transition-colors">Login</a>
                            <button
                                onClick={startAudit}
                                className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center"
                            >
                                Free Audit
                            </button>
                        </div>
                        
                        {/* Mobile menu button */}
                        <button className="md:hidden text-forest">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 hero-gradient opacity-95 z-10"></div>
                <div className="relative z-20 max-w-6xl mx-auto px-6 text-center text-cream">
                    <div className="fade-in-up">
                        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                            <span className="text-gold">Empowering</span> 
                            <span className="">Small Businesses to Thrive.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                            At Oli-Branch, we believe that small businesses are the backbone of our economy. 
                            Our mission is to break down financial barriers and provide every entrepreneur 
                            with the tools and knowledge they need to succeed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="/signup"
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="bg-gold text-forest px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-all"
                            >
                                Start Your Journey
                            </a>
                            <button onClick={startAudit} className="btn-secondary px-8 py-4 rounded-lg text-lg font-semibold">
                                Free Audit
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Oli AI Chat Trigger */}
            <div id="oli-chat-trigger" onClick={talkToOli} title="Talk to Oli AI">
                <img src="resources/Gemini_Generated_Image_qt3fakqt3fakqt3f.png" alt="Oli AI Avatar" className="oli-avatar-img shadow-2xl" />
            </div>

            {/* Audit Modal */}
            {showAuditModal && (
                <div id="audit-modal" className="modal" onClick={closeAudit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeAudit} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal text-2xl">&times;</button>
                        <div id="audit-step-container">
                            <div className="flex items-center space-x-3 mb-4">
                                <img src="resources/oli-branch-1 (9).png" alt="Oli" className="w-12 h-12 rounded-full border border-gold" />
                                <h3 className="font-display text-2xl font-bold text-forest">Oli Financial Audit</h3>
                            </div>
                            
                            <div className="progress-bar mb-8">
                                <div 
                                    id="audit-progress" 
                                    className="progress-fill"
                                    style={{ width: `${auditProgress}%` }}
                                ></div>
                            </div>

                            {auditStep === 1 ? (
                                <div id="step-1">
                                    <label className="block text-sm font-semibold mb-2">What are your average monthly banking fees?</label>
                                    <input 
                                        type="number" 
                                        id="fee-input" 
                                        placeholder="$0.00" 
                                        className="form-input mb-6"
                                        value={monthlyFee}
                                        onChange={(e) => setMonthlyFee(e.target.value)}
                                    />
                                    <button onClick={processAudit} className="btn-primary w-full py-4 rounded-lg font-bold">
                                        Analyze My Fees
                                    </button>
                                </div>
                            ) : (
                                <div id="audit-result">
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold text-forest mb-2">Audit Complete</h4>
                                        <p id="result-text" className="text-gray-700 mb-6">{auditResult}</p>
                                        <button onClick={closeAudit} className="btn-secondary w-full py-3 rounded-lg">
                                            Get Full Report
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ... Rest of the component remains the same ... */}
            
            {/* CSS Styles */}
            <style jsx>{`
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
                .modal { 
                    display: flex !important; 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 100%; 
                    background: rgba(0, 0, 0, 0.6); 
                    z-index: 1000; 
                    align-items: center; 
                    justify-content: center; 
                }
                .modal-content { 
                    background: white; 
                    border-radius: 12px; 
                    padding: 2.5rem; 
                    max-width: 600px; 
                    width: 90%; 
                    max-height: 90vh; 
                    overflow-y: auto; 
                    position: relative; 
                }
                .progress-bar { 
                    width: 100%; 
                    height: 8px; 
                    background: #e2e8f0; 
                    border-radius: 4px; 
                    overflow: hidden; 
                }
                .progress-fill { 
                    height: 100%; 
                    background: #D4AF37; 
                    width: 0%; 
                    transition: width 0.4s ease; 
                }
                .form-input { 
                    width: 100%; 
                    padding: 12px 16px; 
                    border: 2px solid #e2e8f0; 
                    border-radius: 8px; 
                    font-size: 16px; 
                    transition: all 0.3s ease; 
                }
                .form-input:focus { 
                    outline: none; 
                    border-color: #52796F; 
                    box-shadow: 0 0 0 3px rgba(82, 121, 111, 0.1); 
                }
                .fade-in-up { 
                    opacity: 0; 
                    transform: translateY(24px); 
                }
                
                /* Oli Avatar Positioning */
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
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.4);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
                    }
                }
            `}</style>
        </div>
    );
};

export default About;