// index.js - Enhanced functionality for MewBrew Café Homepage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize homepage features
    const homepage = new HomepageFeatures();
    homepage.init();
});

class HomepageFeatures {
    constructor() {
        // DOM Elements
        this.heroSection = document.querySelector('.hero');
        this.featureCards = document.querySelectorAll('.features .card');
        this.ctaSection = document.querySelector('.cta');
        
        // Animation state
        this.animatedElements = new Set();
        
        // Visit tracking
        this.lastVisit = localStorage.getItem('mewbrew_last_visit');
        this.currentVisit = new Date().toISOString();
    }

    init() {
        this.setupHeroAnimation();
        this.setupInteractiveCards();
        this.setupParallaxEffect();
        this.setupVisitorGreeting();
        this.setupStatsCounter();
        this.setupCatAnimation();
        this.setupBookingWidget();
        this.setupTestimonials();
        
        console.log('MewBrew Homepage enhanced');
        
        // Track this visit
        this.trackVisit();
    }

    setupHeroAnimation() {
        if (!this.heroSection) return;
        
        // Add animation classes
        const heroContent = this.heroSection.querySelector('.hero-content');
        const heroImage = this.heroSection.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.classList.add('animate-on-load');
            heroContent.style.animationDelay = '0.2s';
        }
        
        if (heroImage) {
            heroImage.classList.add('animate-on-load');
            heroImage.style.animationDelay = '0.4s';
        }
        
        // Add floating animation to cat illustration
        const catIllustration = this.heroSection.querySelector('.cat-illustration');
        if (catIllustration) {
            catIllustration.style.position = 'relative';
            catIllustration.style.animation = 'float 6s ease-in-out infinite';
        }
    }

    setupInteractiveCards() {
        this.featureCards.forEach((card, index) => {
            // Add data attribute
            card.setAttribute('data-card-index', index);
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCardIn(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardOut(card);
            });
            
            // Add click animation
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.pulseCard(card);
                }
            });
            
            // Add staggered animation delay
            card.style.animationDelay = `${0.3 + (index * 0.2)}s`;
        });
    }

    animateCardIn(card) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        card.style.transition = 'all 0.3s ease';
        
        // Animate icon
        const icon = card.querySelector('.card-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    animateCardOut(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
        
        const icon = card.querySelector('.card-icon i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    }

    pulseCard(card) {
        card.classList.add('pulse');
        setTimeout(() => {
            card.classList.remove('pulse');
        }, 600);
    }

    setupParallaxEffect() {
        // Simple parallax for hero section
        window.addEventListener('scroll', () => {
            if (!this.heroSection) return;
            
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            const heroImage = this.heroSection.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupVisitorGreeting() {
        // Check if returning visitor
        if (this.lastVisit) {
            const lastVisitDate = new Date(this.lastVisit);
            const daysSinceLastVisit = Math.floor(
                (new Date() - lastVisitDate) / (1000 * 60 * 60 * 24)
            );
            
            if (daysSinceLastVisit > 7) {
                // Show welcome back message
                this.showWelcomeBackMessage(daysSinceLastVisit);
            }
        }
    }

    showWelcomeBackMessage(days) {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.className = 'visitor-notification alert alert-info position-fixed';
        notification.style.cssText = `
            top: 80px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-cat me-2"></i>
                <div>
                    <strong>Welcome back!</strong><br>
                    <small>It's been ${days} day${days !== 1 ? 's' : ''} since your last visit.</small>
                </div>
                <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }

    trackVisit() {
        localStorage.setItem('mewbrew_last_visit', this.currentVisit);
    }

    setupStatsCounter() {
        // Create stats counter if not exists
        if (!document.querySelector('.stats-counter')) {
            this.addStatsCounter();
        }
    }

    addStatsCounter() {
        // Insert stats counter before CTA
        const statsHtml = `
            <section class="stats-counter py-5">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-md-3 col-6">
                            <div class="stat-item text-center">
                                <div class="stat-number display-4 fw-bold text-warning mb-2" data-count="150">0</div>
                                <div class="stat-label">Cats Adopted</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="stat-item text-center">
                                <div class="stat-number display-4 fw-bold text-warning mb-2" data-count="5000">0</div>
                                <div class="stat-label">Happy Visitors</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="stat-item text-center">
                                <div class="stat-number display-4 fw-bold text-warning mb-2" data-count="10000">0</div>
                                <div class="stat-label">Cups Served</div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="stat-item text-center">
                                <div class="stat-number display-4 fw-bold text-warning mb-2" data-count="50">0</div>
                                <div class="stat-label">Events Hosted</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.ctaSection.insertAdjacentHTML('beforebegin', statsHtml);
        
        // Animate counters
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counter.hasAttribute('data-animated')) {
                        updateCounter();
                        counter.setAttribute('data-animated', 'true');
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    setupCatAnimation() {
        // Add animated cats to the page
        this.addFloatingCats();
    }

    addFloatingCats() {
        // Create floating cat elements
        const catContainer = document.createElement('div');
        catContainer.className = 'floating-cats';
        catContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        document.body.appendChild(catContainer);
        
        // Add some floating cats
        const catIcons = ['fa-cat', 'fa-paw', 'fa-heart', 'fa-star'];
        
        for (let i = 0; i < 8; i++) {
            const cat = document.createElement('i');
            cat.className = `fas ${catIcons[Math.floor(Math.random() * catIcons.length)]}`;
            cat.style.cssText = `
                position: absolute;
                color: rgba(255, 152, 0, 0.1);
                font-size: ${20 + Math.random() * 30}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatAround ${20 + Math.random() * 20}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            catContainer.appendChild(cat);
        }
    }

    setupBookingWidget() {
        // Add quick booking widget
        this.addQuickBooking();
    }

    addQuickBooking() {
        // Insert quick booking widget after features
        const bookingHtml = `
            <section class="quick-booking py-5 bg-light">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-8">
                            <h3 class="mb-3">Ready to Visit?</h3>
                            <p class="mb-0">Book your spot now for a guaranteed seat with our cats!</p>
                        </div>
                        <div class="col-lg-4 text-lg-end">
                            <a href="booking.html" class="btn btn-warning btn-lg px-5">
                                <i class="fas fa-calendar-check me-2"></i>Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        const featuresSection = document.querySelector('.features');
        if (featuresSection) {
            featuresSection.insertAdjacentHTML('afterend', bookingHtml);
            
            // Add animation to button
            const bookBtn = document.querySelector('.quick-booking .btn');
            if (bookBtn) {
                bookBtn.addEventListener('mouseenter', () => {
                    bookBtn.style.transform = 'translateY(-3px)';
                    bookBtn.style.boxShadow = '0 10px 20px rgba(255, 152, 0, 0.3)';
                    bookBtn.style.transition = 'all 0.3s ease';
                });
                
                bookBtn.addEventListener('mouseleave', () => {
                    bookBtn.style.transform = 'translateY(0)';
                    bookBtn.style.boxShadow = '';
                });
            }
        }
    }

    setupTestimonials() {
        // Add testimonials carousel
        this.addTestimonials();
    }

    addTestimonials() {
        const testimonialsHtml = `
            <section class="testimonials py-5">
                <div class="container">
                    <h2 class="section-title text-center mb-5">What Our Visitors Say</h2>
                    
                    <div class="testimonial-carousel">
                        <div class="testimonial-slide">
                            <div class="testimonial-content text-center">
                                <i class="fas fa-quote-left fa-2x text-warning mb-4"></i>
                                <p class="lead mb-4">"The best cat café experience! The cats are so friendly and the coffee is amazing."</p>
                                <div class="testimonial-author">
                                    <strong>Maria S.</strong>
                                    <div class="stars text-warning">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        const statsSection = document.querySelector('.stats-counter');
        if (statsSection) {
            statsSection.insertAdjacentHTML('afterend', testimonialsHtml);
        }
    }
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', function() {
    window.homepageFeatures = new HomepageFeatures();
    window.homepageFeatures.init();
});