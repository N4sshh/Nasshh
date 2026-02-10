// script.js - Universal Custom JavaScript for MewBrew Café

document.addEventListener('DOMContentLoaded', function() {
    console.log('MewBrew Café loaded successfully!');
    
    // Initialize universal features
    const universal = new UniversalFeatures();
    universal.init();
});

class UniversalFeatures {
    constructor() {
        // Global state
        this.isMobile = window.innerWidth <= 768;
        this.scrollPosition = 0;
        this.visitCount = parseInt(localStorage.getItem('mewbrew_visit_count') || '0');
    }

    init() {
        this.setupMobileMenu();
        this.setupAnimations();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.setupPageTransitions();
        this.trackVisits();
        this.setupBackToTop();
        this.setupTheme();
        
        // Add CSS for animations
        this.addGlobalStyles();
    }

    setupMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('#navbarNav');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (navbarCollapse.classList.contains('show')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = ''; // Restore scrolling
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    if (this.isMobile) {
                        document.body.style.overflow = 'hidden'; // Prevent scrolling
                    }
                }
            });
            
            // Close menu when clicking a link on mobile
            if (this.isMobile) {
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        navbarCollapse.classList.remove('show');
                        navbarToggler.querySelector('i').classList.remove('fa-times');
                        navbarToggler.querySelector('i').classList.add('fa-bars');
                        document.body.style.overflow = '';
                    });
                });
            }
        }
    }

    setupAnimations() {
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Add loading animation to cards with staggered delay
        const cards = document.querySelectorAll('.card:not(.no-animation)');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-on-load');
        });
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add data attribute to track if already animated
                    entry.target.setAttribute('data-animated', 'true');
                    
                    // Remove observer after animation
                    if (entry.target.getAttribute('data-animate-once') === 'true') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll(
            '.card, .section-title, .cta-content, .feature-item, .product-card, .menu-item, .cat-card, .event-item'
        );
        
        animatedElements.forEach(el => {
            // Skip if already has data-animated attribute
            if (!el.hasAttribute('data-animated')) {
                observer.observe(el);
            }
        });
        
        // Store observer for later use
        this.scrollObserver = observer;
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                }
            });
        });
        
        // Smooth scroll to top for logo click
        const logo = document.querySelector('.navbar-brand');
        if (logo) {
            logo.addEventListener('click', (e) => {
                if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    setupNavbarScroll() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Store scroll position for page transitions
            this.scrollPosition = scrollTop;
        });
        
        // Add scroll progress indicator
        this.addScrollProgress();
    }

    addScrollProgress() {
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff9800, #ffb74d);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }

    setupPageTransitions() {
        // Add loading state for page transitions
        document.querySelectorAll('a').forEach(link => {
            if (link.href && link.href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => {
                    // Don't intercept if it's a hash link or external link
                    if (link.getAttribute('href').startsWith('#') || 
                        link.getAttribute('target') === '_blank' ||
                        link.hasAttribute('download')) {
                        return;
                    }
                    
                    // Show loading animation
                    this.showPageTransition();
                });
            }
        });
        
        // Handle page load
        window.addEventListener('load', () => {
            this.hidePageTransition();
        });
    }

    showPageTransition() {
        // Create or show loading overlay
        let overlay = document.querySelector('.page-transition-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            overlay.innerHTML = `
                <div class="page-transition-content">
                    <div class="cat-loader">
                        <i class="fas fa-cat"></i>
                        <i class="fas fa-coffee"></i>
                    </div>
                    <p>Loading...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        
        overlay.classList.add('active');
    }

    hidePageTransition() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    trackVisits() {
        // Track page visits
        this.visitCount++;
        localStorage.setItem('mewbrew_visit_count', this.visitCount.toString());
        
        // Show welcome message for first-time visitors
        if (this.visitCount === 1) {
            this.showWelcomeMessage();
        }
        
        // Track page views
        this.trackPageView();
    }

    showWelcomeMessage() {
        // Create welcome modal for first-time visitors
        setTimeout(() => {
            const welcomeModal = document.createElement('div');
            welcomeModal.className = 'welcome-modal modal fade';
            welcomeModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title text-warning">Welcome to MewBrew Café! 🐱</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-cat fa-4x text-warning mb-3"></i>
                            <h4 class="mb-3">Hello there!</h4>
                            <p class="mb-3">Welcome to our cozy cat café. We're so excited to have you here!</p>
                            <div class="welcome-offer alert alert-info">
                                <i class="fas fa-gift me-2"></i>
                                <strong>First-time visitor offer:</strong> Mention this welcome when you visit for 10% off your first order!
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">
                                Start Exploring!
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(welcomeModal);
            
            const modal = new bootstrap.Modal(welcomeModal);
            modal.show();
            
            // Remove from DOM after hidden
            welcomeModal.addEventListener('hidden.bs.modal', () => {
                welcomeModal.remove();
            });
        }, 1000);
    }

    trackPageView() {
        // Simple page view tracking
        const pageViews = JSON.parse(localStorage.getItem('mewbrew_page_views') || '{}');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
        localStorage.setItem('mewbrew_page_views', JSON.stringify(pageViews));
        
        console.log(`Page view tracked: ${currentPage}`);
    }

    setupBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top btn btn-warning';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(backToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.style.display = 'none';
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add hover effect
        backToTopBtn.addEventListener('mouseenter', () => {
            backToTopBtn.style.transform = 'translateY(-5px)';
        });
        
        backToTopBtn.addEventListener('mouseleave', () => {
            backToTopBtn.style.transform = 'translateY(0)';
        });
    }

    setupTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('mewbrew_theme') || 'light';
        
        // Apply theme
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Add theme toggle button if not exists
        if (!document.querySelector('.theme-toggle')) {
            this.addThemeToggle();
        }
    }

    addThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle btn btn-outline-warning btn-sm position-fixed';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            bottom: 90px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        document.body.appendChild(themeToggle);
        
        // Toggle theme
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('mewbrew_theme', 'dark');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('mewbrew_theme', 'light');
            }
        });
        
        // Update icon based on current theme
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }
    }

    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animation classes */
            .animate-on-load {
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 0.6s ease forwards;
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.6s ease;
            }
            
            /* Page transition overlay */
            .page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .page-transition-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .page-transition-content {
                text-align: center;
            }
            
            .cat-loader {
                position: relative;
                width: 100px;
                height: 100px;
                margin: 0 auto 20px;
            }
            
            .cat-loader .fa-cat {
                font-size: 4rem;
                color: #ff9800;
                animation: bounce 1s infinite alternate;
            }
            
            .cat-loader .fa-coffee {
                font-size: 2rem;
                color: #795548;
                position: absolute;
                bottom: 10px;
                right: 10px;
                animation: rotate 2s linear infinite;
            }
            
            /* Scroll progress */
            .scroll-progress {
                box-shadow: 0 2px 10px rgba(255, 152, 0, 0.2);
            }
            
            /* Navbar scroll effect */
            .navbar-scrolled {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            /* Dark theme */
            .dark-theme {
                background-color: #1a1a1a;
                color: #e0e0e0;
            }
            
            .dark-theme .card {
                background-color: #2d2d2d;
                border-color: #404040;
                color: #e0e0e0;
            }
            
            .dark-theme .navbar {
                background-color: #2d2d2d !important;
            }
            
            .dark-theme footer {
                background-color: #2d2d2d !important;
                border-top-color: #404040;
            }
            
            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes bounce {
                from {
                    transform: translateY(0);
                }
                to {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            /* Back to top button */
            .back-to-top.visible {
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Theme toggle */
            .theme-toggle {
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .theme-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(255, 152, 0, 0.3);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .back-to-top,
                .theme-toggle {
                    bottom: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                }
                
                .theme-toggle {
                    bottom: 75px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Global event listeners
    window.addEventListener('resize', () => {
        // Re-initialize mobile features if needed
        const universal = window.universalFeatures;
        if (universal) {
            universal.isMobile = window.innerWidth <= 768;
        }
    });
    
    // Store universal instance globally for debugging
    window.universalFeatures = new UniversalFeatures();
    window.universalFeatures.init();
});