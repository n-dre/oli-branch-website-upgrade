// Oli-Branch Interactive Functionality
// Core libraries: Anime.js, ECharts, Splide, p5.js, Matter.js, PIXI.js, Shader-park, Typed.js

class OliBranchApp {
    constructor() {
        this.currentStep = 0;
        this.formData = {};
        this.charts = {};
        this.carousels = {};
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initTypewriter();
        this.initFinancialHealthCheck();
        this.initProductMatcher();
        this.initResourceFinder();
        this.initCarousels();
        this.initParticleBackground();
        this.initCharts();
        this.initMicroInteractions();
    }

    // Scroll-triggered animations with Anime.js
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('fade-in-up')) {
                        anime({
                            targets: element,
                            translateY: [24, 0],
                            opacity: [0, 1],
                            duration: 200,
                            easing: 'easeOutQuad'
                        });
                    }
                    
                    if (element.classList.contains('stagger-children')) {
                        anime({
                            targets: element.children,
                            translateY: [24, 0],
                            opacity: [0, 1],
                            duration: 200,
                            delay: anime.stagger(50),
                            easing: 'easeOutQuad'
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up, .stagger-children').forEach(el => {
            observer.observe(el);
        });
    }

    // Typewriter effect for hero text
    initTypewriter() {
        if (document.getElementById('hero-typewriter')) {
            new Typed('#hero-typewriter', {
                strings: [
                    'Empowering Your Financial Journey',
                    'AI-Powered Financial Solutions',
                    'Building Better Business Futures'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Financial Health Check-In Interactive Tool
    initFinancialHealthCheck() {
        const modal = document.getElementById('health-check-modal');
        const startBtn = document.getElementById('start-health-check');
        const closeBtn = document.querySelector('.modal-close');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                this.showStep(0);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                this.resetForm();
            });
        }

        // Step navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-step')) {
                this.nextStep();
            }
            if (e.target.classList.contains('prev-step')) {
                this.prevStep();
            }
        });

        // Form validation and data collection
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('form-input')) {
                this.formData[e.target.name] = e.target.value;
                this.validateStep();
            }
        });
    }

    showStep(stepIndex) {
        const steps = document.querySelectorAll('.check-in-step');
        const progressBar = document.querySelector('.progress-fill');
        
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });

        // Update progress bar
        const progress = ((stepIndex + 1) / steps.length) * 100;
        anime({
            targets: progressBar,
            width: `${progress}%`,
            duration: 300,
            easing: 'easeOutQuad'
        });

        this.currentStep = stepIndex;
        this.validateStep();
    }

    nextStep() {
        const steps = document.querySelectorAll('.check-in-step');
        if (this.currentStep < steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.showResults();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    validateStep() {
        const currentStepEl = document.querySelector('.check-in-step:not([style*="none"])');
        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        const nextBtn = currentStepEl.querySelector('.next-step');
        
        let isValid = true;
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        if (nextBtn) {
            nextBtn.disabled = !isValid;
            nextBtn.classList.toggle('btn-disabled', !isValid);
        }
    }

    showResults() {
        const resultsEl = document.getElementById('check-in-results');
        const recommendations = this.generateRecommendations();
        
        resultsEl.innerHTML = `
            <div class="results-header">
                <h3>Your Personalized Financial Health Report</h3>
                <div class="health-score">
                    <div class="score-circle" data-score="${recommendations.score}">
                        <span class="score-text">${recommendations.score}</span>
                        <span class="score-label">Health Score</span>
                    </div>
                </div>
            </div>
            <div class="recommendations">
                <h4>Your 3 Actionable Strategies:</h4>
                <div class="strategy-cards">
                    ${recommendations.strategies.map(strategy => `
                        <div class="strategy-card">
                            <div class="strategy-icon">${strategy.icon}</div>
                            <h5>${strategy.title}</h5>
                            <p>${strategy.description}</p>
                            <a href="${strategy.link}" class="strategy-cta">Learn More</a>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="results-cta">
                <p>Want detailed guidance? Get your full report via email.</p>
                <form class="email-form">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit" class="btn-primary">Get Full Report</button>
                </form>
            </div>
        `;

        this.showStep(document.querySelectorAll('.check-in-step').length - 1);
        this.animateHealthScore();
    }

    generateRecommendations() {
        // Mock recommendation logic based on form data
        const businessType = this.formData.businessType || 'small-business';
        const challenges = this.formData.challenges || [];
        
        const strategies = [
            {
                icon: '🎯',
                title: 'Quick Win: Expense Optimization',
                description: 'Identify and eliminate unnecessary expenses to improve cash flow immediately.',
                link: '#expense-optimization'
            },
            {
                icon: '📈',
                title: 'Priority Goal: Revenue Growth',
                description: 'Focus on high-margin products and customer retention strategies.',
                link: '#revenue-growth'
            },
            {
                icon: '🤝',
                title: 'Custom Resource: Grant Matcher',
                description: 'We found 3 grants that match your business profile perfectly.',
                link: '#grant-finder'
            }
        ];

        return {
            score: Math.floor(Math.random() * 30) + 65, // 65-95
            strategies: strategies
        };
    }

    animateHealthScore() {
        const scoreCircle = document.querySelector('.score-circle');
        const scoreText = document.querySelector('.score-text');
        const score = parseInt(scoreCircle.dataset.score);
        
        anime({
            targets: scoreText,
            innerHTML: [0, score],
            duration: 2000,
            round: 1,
            easing: 'easeOutQuad'
        });

        anime({
            targets: scoreCircle,
            rotate: '1turn',
            duration: 2000,
            easing: 'easeOutQuad'
        });
    }

    resetForm() {
        this.currentStep = 0;
        this.formData = {};
        document.querySelectorAll('.form-input').forEach(input => {
            input.value = '';
        });
    }

    // AI-Powered Banking Product Matcher
    initProductMatcher() {
        const matcherContainer = document.getElementById('product-matcher');
        if (!matcherContainer) return;

        const questions = [
            {
                id: 'business-need',
                question: 'What\'s your primary business need?',
                options: [
                    { value: 'banking', label: 'Business Banking', icon: '🏦' },
                    { value: 'loans', label: 'Business Loans', icon: '💰' },
                    { value: 'credit', label: 'Credit Lines', icon: '💳' },
                    { value: 'investment', label: 'Investment Services', icon: '📈' }
                ]
            },
            {
                id: 'business-size',
                question: 'What\'s your business size?',
                options: [
                    { value: 'startup', label: 'Startup (0-2 years)', icon: '🚀' },
                    { value: 'small', label: 'Small Business (3-10 employees)', icon: '🏢' },
                    { value: 'medium', label: 'Medium Business (11-50 employees)', icon: '🏭' },
                    { value: 'large', label: 'Large Business (50+ employees)', icon: '🏙️' }
                ]
            },
            {
                id: 'monthly-revenue',
                question: 'What\'s your approximate monthly revenue?',
                options: [
                    { value: '0-10k', label: '$0 - $10,000', icon: '🌱' },
                    { value: '10k-50k', label: '$10,000 - $50,000', icon: '🌿' },
                    { value: '50k-100k', label: '$50,000 - $100,000', icon: '🌳' },
                    { value: '100k+', label: '$100,000+', icon: '🏔️' }
                ]
            }
        ];

        this.renderProductMatcher(questions);
    }

    renderProductMatcher(questions) {
        const container = document.getElementById('product-matcher');
        let html = '<div class="matcher-questions">';
        
        questions.forEach((q, index) => {
            html += `
                <div class="matcher-question" data-question="${index}">
                    <h4>${q.question}</h4>
                    <div class="matcher-options">
                        ${q.options.map(option => `
                            <button class="matcher-option" data-value="${option.value}">
                                <span class="option-icon">${option.icon}</span>
                                <span class="option-label">${option.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div><div class="matcher-results" style="display: none;"></div>';
        container.innerHTML = html;

        // Add event listeners
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('matcher-option')) {
                this.selectMatcherOption(e.target);
            }
        });
    }

    selectMatcherOption(button) {
        const question = button.closest('.matcher-question');
        const questionIndex = question.dataset.question;
        
        // Remove active state from siblings
        question.querySelectorAll('.matcher-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add active state to selected option
        button.classList.add('selected');
        
        // Store selection
        this.formData[`question_${questionIndex}`] = button.dataset.value;
        
        // Check if all questions answered
        this.checkMatcherCompletion();
    }

    checkMatcherCompletion() {
        const questions = document.querySelectorAll('.matcher-question');
        const answeredQuestions = Object.keys(this.formData).filter(key => key.startsWith('question_')).length;
        
        if (answeredQuestions === questions.length) {
            this.showProductResults();
        }
    }

    showProductResults() {
        const resultsEl = document.querySelector('.matcher-results');
        const products = this.generateProductRecommendations();
        
        resultsEl.innerHTML = `
            <h3>Recommended Banking Products for You</h3>
            <div class="product-cards">
                ${products.map(product => `
                    <div class="product-card">
                        <div class="product-header">
                            <h4>${product.name}</h4>
                            <div class="product-rating">${product.rating}/5</div>
                        </div>
                        <div class="product-features">
                            ${product.features.map(feature => `
                                <div class="feature">${feature}</div>
                            `).join('')}
                        </div>
                        <div class="product-pricing">
                            <span class="price">${product.price}</span>
                            <span class="period">${product.period}</span>
                        </div>
                        <a href="${product.link}" class="btn-primary">Apply Now</a>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultsEl.style.display = 'block';
        
        // Animate results
        anime({
            targets: '.product-card',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });
    }

    generateProductRecommendations() {
        // Mock product recommendations based on answers
        return [
            {
                name: 'Business Growth Checking',
                rating: 4.8,
                features: ['No monthly fees', 'Unlimited transactions', 'Cashback rewards', 'Mobile banking'],
                price: '$0',
                period: '/month',
                link: '#apply-checking'
            },
            {
                name: 'SBA Express Loan',
                rating: 4.6,
                features: ['Up to $500k', 'Fast approval', 'Competitive rates', 'No collateral required'],
                price: '5.5%',
                period: 'APR',
                link: '#apply-loan'
            },
            {
                name: 'Business Credit Line',
                rating: 4.7,
                features: ['Revolving credit', 'Pay interest only', 'No annual fee', 'Quick access'],
                price: '8.9%',
                period: 'APR',
                link: '#apply-credit'
            }
        ];
    }

    // Resource Finder
    initResourceFinder() {
        const finderContainer = document.getElementById('resource-finder');
        if (!finderContainer) return;

        const resources = [
            {
                title: 'SBA 7(a) Loan Program',
                category: 'loans',
                deadline: '2025-12-31',
                amount: '$50,000 - $5M',
                eligibility: 'Small businesses with good credit',
                location: 'nationwide',
                description: 'The most common SBA loan program for working capital, equipment, and real estate.'
            },
            {
                title: 'State Small Business Grant',
                category: 'grants',
                deadline: '2025-09-15',
                amount: '$5,000 - $25,000',
                eligibility: 'Businesses under 2 years old',
                location: 'state',
                description: 'Grants for new businesses to cover startup costs and initial operations.'
            },
            {
                title: 'Minority Business Development Program',
                category: 'development',
                deadline: '2025-11-30',
                amount: 'Technical assistance',
                eligibility: 'Minority-owned businesses',
                location: 'nationwide',
                description: 'Free business consulting, training, and networking opportunities.'
            }
        ];

        this.renderResourceFinder(resources);
    }

    renderResourceFinder(resources) {
        const container = document.getElementById('resource-finder');
        
        container.innerHTML = `
            <div class="finder-filters">
                <select class="filter-select" data-filter="category">
                    <option value="">All Categories</option>
                    <option value="loans">Loans</option>
                    <option value="grants">Grants</option>
                    <option value="development">Development</option>
                </select>
                <select class="filter-select" data-filter="location">
                    <option value="">All Locations</option>
                    <option value="nationwide">Nationwide</option>
                    <option value="state">State Level</option>
                    <option value="local">Local</option>
                </select>
                <input type="text" class="search-input" placeholder="Search resources...">
            </div>
            <div class="resource-cards">
                ${resources.map(resource => `
                    <div class="resource-card" data-category="${resource.category}" data-location="${resource.location}">
                        <div class="resource-header">
                            <h4>${resource.title}</h4>
                            <span class="resource-category">${resource.category}</span>
                        </div>
                        <div class="resource-details">
                            <div class="detail-row">
                                <span class="detail-label">Amount:</span>
                                <span class="detail-value">${resource.amount}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Deadline:</span>
                                <span class="detail-value">${resource.deadline}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Eligibility:</span>
                                <span class="detail-value">${resource.eligibility}</span>
                            </div>
                        </div>
                        <p class="resource-description">${resource.description}</p>
                        <a href="#apply-${resource.title.toLowerCase().replace(/\\s+/g, '-')}" class="btn-secondary">Apply Now</a>
                    </div>
                `).join('')}
            </div>
        `;

        // Add filter functionality
        container.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-select')) {
                this.filterResources();
            }
        });

        container.addEventListener('input', (e) => {
            if (e.target.classList.contains('search-input')) {
                this.searchResources(e.target.value);
            }
        });
    }

    filterResources() {
        const categoryFilter = document.querySelector('[data-filter="category"]').value;
        const locationFilter = document.querySelector('[data-filter="location"]').value;
        const cards = document.querySelectorAll('.resource-card');

        cards.forEach(card => {
            const matchesCategory = !categoryFilter || card.dataset.category === categoryFilter;
            const matchesLocation = !locationFilter || card.dataset.location === locationFilter;
            
            if (matchesCategory && matchesLocation) {
                card.style.display = 'block';
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchResources(query) {
        const cards = document.querySelectorAll('.resource-card');
        const searchTerm = query.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('.resource-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Initialize carousels with Splide
    initCarousels() {
        // Testimonials carousel
        if (document.querySelector('.testimonials-carousel')) {
            this.carousels.testimonials = new Splide('.testimonials-carousel', {
                type: 'loop',
                perPage: 1,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 5000,
                pauseOnHover: true,
                arrows: false,
                pagination: true
            }).mount();
        }

        // Case studies carousel
        if (document.querySelector('.case-studies-carousel')) {
            this.carousels.caseStudies = new Splide('.case-studies-carousel', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                breakpoints: {
                    768: { perPage: 1 },
                    1024: { perPage: 2 }
                }
            }).mount();
        }
    }

    // Particle background with p5.js
    initParticleBackground() {
        if (document.getElementById('particle-canvas')) {
            new p5((p) => {
                let particles = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                    canvas.parent('particle-canvas');
                    
                    // Create particles
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-0.5, 0.5),
                            vy: p.random(-0.5, 0.5),
                            size: p.random(2, 6)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // Update and draw particles
                    particles.forEach(particle => {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // Wrap around edges
                        if (particle.x < 0) particle.x = p.width;
                        if (particle.x > p.width) particle.x = 0;
                        if (particle.y < 0) particle.y = p.height;
                        if (particle.y > p.height) particle.y = 0;
                        
                        // Draw particle
                        p.fill(27, 67, 50, 100); // Forest green with transparency
                        p.noStroke();
                        p.ellipse(particle.x, particle.y, particle.size);
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(window.innerWidth, window.innerHeight);
                };
            });
        }
    }

    // Initialize charts with ECharts
    initCharts() {
        // Financial health chart
        if (document.getElementById('health-chart')) {
            const chart = echarts.init(document.getElementById('health-chart'));
            
            const option = {
                color: ['#52796F', '#1B4332', '#D4AF37'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [{
                    name: 'Financial Health',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 35, name: 'Cash Flow' },
                        { value: 25, name: 'Profitability' },
                        { value: 20, name: 'Growth' },
                        { value: 20, name: 'Stability' }
                    ]
                }]
            };
            
            chart.setOption(option);
            this.charts.health = chart;
        }

        // Growth chart
        if (document.getElementById('growth-chart')) {
            const chart = echarts.init(document.getElementById('growth-chart'));
            
            const option = {
                color: ['#52796F'],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330],
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }]
            };
            
            chart.setOption(option);
            this.charts.growth = chart;
        }

        // Resize charts on window resize
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                chart.resize();
            });
        });
    }

    // Micro-interactions
    initMicroInteractions() {
        // Button hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
                anime({
                    targets: e.target,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
                anime({
                    targets: e.target,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        }, true);

        // Card hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('service-card') || e.target.classList.contains('product-card')) {
                anime({
                    targets: e.target,
                    translateY: -8,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('service-card') || e.target.classList.contains('product-card')) {
                anime({
                    targets: e.target,
                    translateY: 0,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }, true);

        // Form field focus effects
        document.addEventListener('focus', (e) => {
            if (e.target.classList.contains('form-input')) {
                anime({
                    targets: e.target,
                    borderColor: '#52796F',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('form-input')) {
                anime({
                    targets: e.target,
                    borderColor: '#e2e8f0',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        }, true);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OliBranchApp();
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            translateY: [0, -100],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// Email form submission
document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('email-form')) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Mock API call
        setTimeout(() => {
            showNotification('Thank you! Your report will be sent shortly.', 'success');
            e.target.reset();
        }, 1000);
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});