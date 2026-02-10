// contact.js - Enhanced functionality for MewBrew Café Contact Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact system
    const contactSystem = new ContactSystem();
    contactSystem.init();
});

class ContactSystem {
    constructor() {
        // DOM Elements
        this.contactForm = document.querySelector('.contact-form');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.subjectSelect = document.getElementById('subject');
        this.messageInput = document.getElementById('message');
        
        // FAQ Elements
        this.faqAccordion = document.getElementById('faqAccordion');
        this.faqItems = document.querySelectorAll('.accordion-item');
        
        // Info cards
        this.infoCards = document.querySelectorAll('.info-card');
        
        // Contact messages storage
        this.contactMessages = JSON.parse(localStorage.getItem('mewbrew_contact_messages') || '[]');
        
        // FAQ data
        this.faqData = [
            {
                id: 'faq1',
                question: 'Do I need to book in advance?',
                answer: 'We highly recommend booking in advance, especially on weekends and holidays, as we have limited capacity to ensure a comfortable experience for both visitors and cats. Walk-ins are welcome based on availability.',
                category: 'booking',
                views: 0
            },
            {
                id: 'faq2',
                question: 'Are children allowed in the café?',
                answer: 'Yes, children aged 8 and above are welcome when accompanied by an adult. We ask that children be supervised at all times and taught to be gentle with the cats.',
                category: 'general',
                views: 0
            },
            {
                id: 'faq3',
                question: 'Can I bring my own cat?',
                answer: 'For the safety and comfort of our rescue cats, we do not allow outside cats in the café. All our cats are vaccinated and have been carefully introduced to each other in our controlled environment.',
                category: 'cats',
                views: 0
            },
            {
                id: 'faq4',
                question: 'Do you serve food and drinks?',
                answer: 'Yes, we have a full menu of coffee, tea, non-coffee drinks, and pastries. Food and drinks must be consumed in the designated human area, not in the cat zones.',
                category: 'menu',
                views: 0
            },
            {
                id: 'faq5',
                question: 'How can I adopt a cat from MewBrew?',
                answer: 'Visit our Cats page to see available cats, then fill out the adoption inquiry form. Our adoption process includes a meeting with the cat, application review, and a virtual home check. Adoption fees help cover veterinary costs.',
                category: 'adoption',
                views: 0
            }
        ];
    }

    init() {
        this.setupContactForm();
        this.setupFAQ();
        this.setupInfoCards();
        this.setupDirections();
        this.setupQuickLinks();
        
        console.log('MewBrew Contact System initialized');
    }

    setupContactForm() {
        if (!this.contactForm) return;
        
        // Form validation
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateContactForm()) {
                this.submitContactForm();
            }
        });
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Auto-save form data
        this.setupAutoSave();
        
        // Subject-based dynamic help
        this.setupSubjectBasedHelp();
    }

    setupRealTimeValidation() {
        const fields = [this.nameInput, this.emailInput, this.subjectSelect, this.messageInput];
        
        fields.forEach(field => {
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                    
                    // Auto-grow message textarea
                    if (field.id === 'message') {
                        this.autoGrowTextarea(field);
                    }
                });
            }
        });
    }

    validateContactForm() {
        let isValid = true;
        
        // Validate each field
        if (!this.validateField(this.nameInput)) isValid = false;
        if (!this.validateField(this.emailInput)) isValid = false;
        if (!this.validateField(this.subjectSelect)) isValid = false;
        if (!this.validateField(this.messageInput)) isValid = false;
        
        // Check spam (basic)
        if (this.messageInput && this.messageInput.value.toLowerCase().includes('http://')) {
            this.showAlert('Please remove URLs from your message', 'warning');
            isValid = false;
        }
        
        // Check message length
        if (this.messageInput && this.messageInput.value.trim().length < 10) {
            this.showFieldError(this.messageInput, 'Please provide more details (minimum 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        if (!field) return false;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(field.id) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (value.length > 100) {
                    errorMessage = 'Name is too long (max 100 characters)';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Please select a subject';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length > 2000) {
                    errorMessage = 'Message is too long (max 2000 characters)';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class
        field.classList.add('is-invalid');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        // Insert after field
        field.parentNode.appendChild(errorDiv);
        
        // Scroll to error if needed
        const rect = field.getBoundingClientRect();
        if (rect.top < 100 || rect.bottom > window.innerHeight) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        
        // Remove error message
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    autoGrowTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        
        // Update character count
        this.updateCharacterCount(textarea);
    }

    updateCharacterCount(textarea) {
        let counter = textarea.parentNode.querySelector('.char-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter form-text text-end mt-1';
            counter.style.fontSize = '0.875rem';
            textarea.parentNode.appendChild(counter);
        }
        
        const current = textarea.value.length;
        const max = 2000;
        counter.textContent = `${current}/${max} characters`;
        
        if (current > max * 0.9) {
            counter.classList.add('text-warning');
        } else {
            counter.classList.remove('text-warning');
        }
    }

    setupAutoSave() {
        const formFields = [this.nameInput, this.emailInput, this.subjectSelect, this.messageInput];
        const storageKey = 'mewbrew_contact_draft';
        
        // Load saved draft
        const savedDraft = localStorage.getItem(storageKey);
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (this.nameInput) this.nameInput.value = draft.name || '';
                if (this.emailInput) this.emailInput.value = draft.email || '';
                if (this.subjectSelect) this.subjectSelect.value = draft.subject || '';
                if (this.messageInput) this.messageInput.value = draft.message || '';
                
                // Auto-grow textarea if there's content
                if (this.messageInput && this.messageInput.value) {
                    this.autoGrowTextarea(this.messageInput);
                }
                
                // Show restore notification
                if (draft.timestamp) {
                    const restoreBtn = document.createElement('button');
                    restoreBtn.className = 'btn btn-sm btn-outline-warning mt-2';
                    restoreBtn.innerHTML = '<i class="fas fa-history me-1"></i>Restored from draft';
                    restoreBtn.addEventListener('click', () => {
                        localStorage.removeItem(storageKey);
                        restoreBtn.remove();
                        this.showToast('Draft cleared', 'info');
                    });
                    
                    const formSubmit = this.contactForm.querySelector('.form-submit');
                    if (formSubmit) {
                        formSubmit.insertAdjacentElement('beforebegin', restoreBtn);
                    }
                }
            } catch (e) {
                console.error('Failed to load draft:', e);
            }
        }
        
        // Auto-save on change
        formFields.forEach(field => {
            if (field) {
                field.addEventListener('change', () => {
                    this.saveFormDraft();
                });
                
                field.addEventListener('input', () => {
                    // Debounce the auto-save
                    clearTimeout(this.saveTimeout);
                    this.saveTimeout = setTimeout(() => {
                        this.saveFormDraft();
                    }, 1000);
                });
            }
        });
    }

    saveFormDraft() {
        const draft = {
            name: this.nameInput?.value || '',
            email: this.emailInput?.value || '',
            subject: this.subjectSelect?.value || '',
            message: this.messageInput?.value || '',
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('mewbrew_contact_draft', JSON.stringify(draft));
    }

    setupSubjectBasedHelp() {
        if (!this.subjectSelect) return;
        
        this.subjectSelect.addEventListener('change', () => {
            const subject = this.subjectSelect.value;
            const helpTexts = {
                'booking': 'For booking inquiries, please include your preferred date and number of guests.',
                'adoption': 'For adoption inquiries, please specify which cat you\'re interested in.',
                'feedback': 'We appreciate your feedback! Please be as specific as possible.',
                'partnership': 'Tell us about your organization and proposed partnership.',
                'general': 'How can we help you today?',
                'other': 'Please provide details about your inquiry.'
            };
            
            this.showSubjectHelp(helpTexts[subject] || '');
        });
    }

    showSubjectHelp(text) {
        // Remove existing help
        let helpDiv = this.contactForm.querySelector('.subject-help');
        
        if (!helpDiv && text) {
            helpDiv = document.createElement('div');
            helpDiv.className = 'subject-help alert alert-info alert-dismissible fade show mt-2';
            helpDiv.innerHTML = `
                <i class="fas fa-lightbulb me-2"></i>${text}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            this.subjectSelect.parentNode.appendChild(helpDiv);
        } else if (helpDiv) {
            if (text) {
                helpDiv.innerHTML = `<i class="fas fa-lightbulb me-2"></i>${text}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
                helpDiv.classList.remove('d-none');
            } else {
                helpDiv.classList.add('d-none');
            }
        }
    }

    submitContactForm() {
        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            id: 'MSG-' + Date.now().toString().slice(-8),
            name: this.nameInput.value,
            email: this.emailInput.value,
            subject: this.subjectSelect.value,
            subjectText: this.subjectSelect.options[this.subjectSelect.selectedIndex].text,
            message: this.messageInput.value,
            timestamp: new Date().toISOString(),
            status: 'unread',
            ip: this.getClientIP()
        };
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Save to localStorage
            this.contactMessages.push(formData);
            localStorage.setItem('mewbrew_contact_messages', JSON.stringify(this.contactMessages));
            
            // Clear draft
            localStorage.removeItem('mewbrew_contact_draft');
            
            // Show success modal with details
            this.showContactSuccessModal(formData);
            
            // Reset form
            this.contactForm.reset();
            this.contactForm.classList.remove('was-validated');
            
            // Clear character counter
            const counter = this.messageInput?.parentNode.querySelector('.char-counter');
            if (counter) counter.remove();
            
            // Reset textarea height
            if (this.messageInput) {
                this.messageInput.style.height = 'auto';
            }
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Send confirmation email (simulated)
            this.sendConfirmationEmail(formData);
            
            console.log('Contact form submitted:', formData);
            
        }, 1500);
    }

    showContactSuccessModal(messageData) {
        const modalElement = document.getElementById('successModal');
        if (!modalElement) return;
        
        const modal = new bootstrap.Modal(modalElement);
        const modalBody = modalElement.querySelector('.modal-body');
        
        if (!modalBody) return;
        
        const successDetails = `
            <i class="fas fa-envelope-open-text fa-4x text-warning mb-3"></i>
            <h4 class="mb-3">Thank You for Contacting Us!</h4>
            <div class="message-details mb-3 p-3 bg-light rounded">
                <p class="mb-1"><strong>Reference:</strong> ${messageData.id}</p>
                <p class="mb-1"><strong>Subject:</strong> ${messageData.subjectText}</p>
                <p class="mb-0"><strong>Submitted:</strong> ${new Date(messageData.timestamp).toLocaleString()}</p>
            </div>
            <p class="mb-0">Your message has been sent successfully. We'll get back to you within 24-48 hours.</p>
            <div class="mt-3">
                <button class="btn btn-sm btn-outline-warning copy-reference-btn" data-reference="${messageData.id}">
                    <i class="fas fa-copy me-1"></i>Copy Reference
                </button>
            </div>
        `;
        
        modalBody.innerHTML = successDetails;
        modal.show();
        
        // Add copy reference button functionality
        modalBody.querySelector('.copy-reference-btn')?.addEventListener('click', (e) => {
            const ref = e.target.dataset.reference;
            navigator.clipboard.writeText(ref).then(() => {
                this.showToast('Reference copied to clipboard!', 'success');
            });
        });
    }

    sendConfirmationEmail(messageData) {
        // In a real application, this would call your backend
        console.log('Confirmation email would be sent to:', messageData.email);
        // Simulate email tracking
        localStorage.setItem('last_email_sent', JSON.stringify({
            to: messageData.email,
            timestamp: new Date().toISOString(),
            subject: `MewBrew Café: We've received your message (${messageData.id})`
        }));
    }

    setupFAQ() {
        if (!this.faqAccordion) return;
        
        // Load FAQ views from localStorage
        const savedViews = localStorage.getItem('mewbrew_faq_views');
        if (savedViews) {
            try {
                const savedData = JSON.parse(savedViews);
                this.faqData.forEach((faq, index) => {
                    if (savedData[index]) {
                        faq.views = savedData[index].views || 0;
                    }
                });
            } catch (e) {
                console.error('Failed to load FAQ views:', e);
            }
        }
        
        // Track FAQ views
        this.faqItems.forEach((item, index) => {
            const button = item.querySelector('.accordion-button');
            const collapseId = button?.getAttribute('data-bs-target')?.replace('#', '');
            const collapse = collapseId ? document.getElementById(collapseId) : null;
            
            if (button && collapse) {
                collapse.addEventListener('show.bs.collapse', () => {
                    // Track view
                    if (this.faqData[index]) {
                        this.faqData[index].views++;
                        localStorage.setItem('mewbrew_faq_views', JSON.stringify(this.faqData));
                    }
                    
                    // Add animation
                    item.classList.add('faq-active');
                    
                    // Update FAQ stats
                    this.updateFAQStats();
                });
                
                collapse.addEventListener('hide.bs.collapse', () => {
                    item.classList.remove('faq-active');
                });
            }
        });
        
        // Add FAQ search
        this.addFAQSearch();
        
        // Add FAQ categories filter
        this.addFAQCategories();
    }

    addFAQSearch() {
        const faqSection = document.querySelector('.faq-section');
        if (!faqSection) return;
        
        const searchDiv = document.createElement('div');
        searchDiv.className = 'faq-search mb-4';
        searchDiv.innerHTML = `
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input type="search" class="form-control" placeholder="Search FAQs..." id="faqSearch">
                <button class="btn btn-outline-warning" type="button" id="clearSearch">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results mt-2" style="display: none;"></div>
        `;
        
        faqSection.insertBefore(searchDiv, this.faqAccordion);
        
        const searchInput = document.getElementById('faqSearch');
        const clearBtn = document.getElementById('clearSearch');
        const resultsDiv = searchDiv.querySelector('.search-results');
        
        if (!searchInput || !clearBtn || !resultsDiv) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length >= 2) {
                this.searchFAQs(query, resultsDiv);
            } else {
                resultsDiv.style.display = 'none';
                this.showAllFAQs();
            }
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            resultsDiv.style.display = 'none';
            this.showAllFAQs();
            searchInput.focus();
        });
    }

    searchFAQs(query, resultsDiv) {
        const results = this.faqData.filter(faq => 
            faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
            resultsDiv.innerHTML = `
                <div class="alert alert-info">
                    Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"
                </div>
            `;
            
            results.forEach((faq) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'card mb-2';
                resultItem.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">${faq.question}</h6>
                        <p class="card-text small text-muted">${faq.answer.substring(0, 100)}...</p>
                        <button class="btn btn-sm btn-outline-warning goto-faq-btn" data-faq="${faq.id}">
                            View Answer
                        </button>
                    </div>
                `;
                resultsDiv.appendChild(resultItem);
            });
            
            resultsDiv.style.display = 'block';
            
            // Add click handlers
            resultsDiv.querySelectorAll('.goto-faq-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const faqId = e.target.dataset.faq;
                    this.scrollToFAQ(faqId);
                    resultsDiv.style.display = 'none';
                    document.getElementById('faqSearch').value = '';
                });
            });
        } else {
            resultsDiv.innerHTML = `
                <div class="alert alert-warning">
                    No results found for "${query}"
                </div>
            `;
            resultsDiv.style.display = 'block';
        }
        
        // Hide non-matching FAQs
        this.hideNonMatchingFAQs(query);
    }

    hideNonMatchingFAQs(query) {
        this.faqItems.forEach((item, index) => {
            const faq = this.faqData[index];
            if (faq) {
                const matches = faq.question.toLowerCase().includes(query) || 
                               faq.answer.toLowerCase().includes(query);
                item.style.display = matches ? 'block' : 'none';
            }
        });
    }

    showAllFAQs() {
        this.faqItems.forEach(item => {
            item.style.display = 'block';
        });
    }

    scrollToFAQ(faqId) {
        const faqItem = document.getElementById(faqId);
        if (faqItem) {
            // Open the accordion
            const button = faqItem.querySelector('.accordion-button');
            if (button && button.classList.contains('collapsed')) {
                button.click();
            }
            
            // Scroll to FAQ
            faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight
            faqItem.classList.add('highlight-faq');
            setTimeout(() => faqItem.classList.remove('highlight-faq'), 2000);
        }
    }

    addFAQCategories() {
        const categories = [...new Set(this.faqData.map(faq => faq.category))];
        const searchDiv = document.querySelector('.faq-search');
        
        if (searchDiv && categories.length > 1) {
            const categoriesDiv = document.createElement('div');
            categoriesDiv.className = 'faq-categories mb-3';
            categoriesDiv.innerHTML = `
                <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-light text-dark category-badge active" data-category="all">All</span>
                    ${categories.map(cat => 
                        `<span class="badge bg-light text-dark category-badge" data-category="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>`
                    ).join('')}
                </div>
            `;
            
            searchDiv.parentNode.insertBefore(categoriesDiv, searchDiv);
            
            // Add category filter functionality
            categoriesDiv.querySelectorAll('.category-badge').forEach(badge => {
                badge.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    
                    // Update active badge
                    categoriesDiv.querySelectorAll('.category-badge').forEach(b => 
                        b.classList.remove('active')
                    );
                    e.target.classList.add('active');
                    
                    // Filter FAQs
                    this.filterFAQsByCategory(category);
                });
            });
        }
    }

    filterFAQsByCategory(category) {
        this.faqItems.forEach((item, index) => {
            const faq = this.faqData[index];
            if (faq) {
                const show = category === 'all' || faq.category === category;
                item.style.display = show ? 'block' : 'none';
            }
        });
    }

    updateFAQStats() {
        const totalViews = this.faqData.reduce((sum, faq) => sum + faq.views, 0);
        console.log(`Total FAQ views: ${totalViews}`);
        
        // Optional: Update a stats display if you add one
        const statsDisplay = document.getElementById('faqStats');
        if (statsDisplay) {
            statsDisplay.textContent = `Total FAQ views: ${totalViews}`;
        }
    }

    setupInfoCards() {
        this.infoCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease';
                
                const icon = card.querySelector('.info-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                const icon = card.querySelector('.info-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
            
            // Add click analytics
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    const action = e.target.textContent.trim().toLowerCase();
                    this.trackContactAction(action);
                }
            });
        });
    }

    setupDirections() {
        const copyBtn = document.querySelector('#directionsModal .copy-coordinates-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCoordinates());
        }
        
        // Initialize map placeholder with interactive features
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.style.cursor = 'pointer';
            mapPlaceholder.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('directionsModal'));
                modal.show();
            });
            
            // Add hover effect
            mapPlaceholder.addEventListener('mouseenter', () => {
                mapPlaceholder.style.opacity = '0.8';
            });
            
            mapPlaceholder.addEventListener('mouseleave', () => {
                mapPlaceholder.style.opacity = '1';
            });
        }
    }

    copyCoordinates() {
        const coordinates = '10.7202° N, 122.5621° E';
        navigator.clipboard.writeText(coordinates).then(() => {
            this.showToast('Coordinates copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy coordinates:', err);
            this.showAlert('Failed to copy coordinates. Please try again.', 'danger');
        });
    }

    setupQuickLinks() {
        // Add quick contact buttons
        this.addQuickContactButtons();
        
        // Add business hours check
        this.addBusinessHoursCheck();
    }

    addQuickContactButtons() {
        const contactSection = document.querySelector('.contact-info');
        if (!contactSection) return;
        
        const quickButtons = document.createElement('div');
        quickButtons.className = 'quick-contact-buttons text-center mt-4';
        quickButtons.innerHTML = `
            <h5 class="mb-3">Quick Contact</h5>
            <div class="d-flex flex-wrap justify-content-center gap-2">
                <button class="btn btn-outline-warning quick-btn" data-action="call">
                    <i class="fas fa-phone me-2"></i>Call Now
                </button>
                <button class="btn btn-outline-warning quick-btn" data-action="whatsapp">
                    <i class="fab fa-whatsapp me-2"></i>WhatsApp
                </button>
                <button class="btn btn-outline-warning quick-btn" data-action="map">
                    <i class="fas fa-map-marked-alt me-2"></i>Open Map
                </button>
                <button class="btn btn-outline-warning quick-btn" data-action="email">
                    <i class="fas fa-envelope me-2"></i>Quick Email
                </button>
            </div>
        `;
        
        contactSection.parentNode.insertBefore(quickButtons, contactSection.nextSibling);
        
        // Add click handlers
        quickButtons.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action || e.target.closest('.quick-btn').dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'call':
                window.location.href = 'tel:+6331234567';
                break;
            case 'whatsapp':
                window.open('https://wa.me/639123456789?text=Hello%20MewBrew%20Café!', '_blank');
                break;
            case 'map':
                window.open('https://maps.google.com/?q=123+Cat+Street,+Iloilo+City', '_blank');
                break;
            case 'email':
                this.prepareQuickEmail();
                break;
        }
    }

    prepareQuickEmail() {
        // Auto-fill email form
        if (this.subjectSelect) {
            this.subjectSelect.value = 'general';
            if (this.messageInput) {
                this.messageInput.value = 'Hello MewBrew Café,\n\n';
                this.messageInput.focus();
                this.messageInput.selectionStart = this.messageInput.value.length;
                this.autoGrowTextarea(this.messageInput);
            }
            
            // Scroll to form
            this.contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    addBusinessHoursCheck() {
        const hoursCard = document.querySelector('.info-card:nth-child(2)');
        if (!hoursCard) return;
        
        const currentHour = new Date().getHours();
        const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Café hours: Monday-Sunday, 10 AM - 9 PM
        const isWeekday = currentDay >= 1 && currentDay <= 7;
        const isWithinHours = currentHour >= 10 && currentHour < 21;
        const isOpen = isWeekday && isWithinHours;
        
        const cardBody = hoursCard.querySelector('.card-body');
        if (!cardBody) return;
        
        // Remove existing status badge if any
        const existingBadge = cardBody.querySelector('.hours-status-badge');
        if (existingBadge) existingBadge.remove();
        
        const statusBadge = document.createElement('span');
        statusBadge.className = `hours-status-badge badge ${isOpen ? 'bg-success' : 'bg-secondary'} position-absolute top-0 end-0 m-3`;
        statusBadge.textContent = isOpen ? 'Open Now' : 'Closed';
        
        cardBody.appendChild(statusBadge);
        
        // Remove existing closing alert if any
        const existingAlert = cardBody.querySelector('.closing-alert');
        if (existingAlert) existingAlert.remove();
        
        // Add real-time status update
        if (isOpen) {
            const closingTime = new Date();
            closingTime.setHours(21, 0, 0, 0);
            const timeUntilClose = closingTime - new Date();
            const hoursUntilClose = Math.floor(timeUntilClose / (1000 * 60 * 60));
            
            if (hoursUntilClose < 2) {
                const closingAlert = document.createElement('div');
                closingAlert.className = 'closing-alert alert alert-warning alert-sm mt-3 mb-0';
                closingAlert.innerHTML = `<i class="fas fa-clock me-2"></i>Closes in ${hoursUntilClose} hour${hoursUntilClose !== 1 ? 's' : ''}`;
                cardBody.appendChild(closingAlert);
            }
        }
    }

    trackContactAction(action) {
        const actions = JSON.parse(localStorage.getItem('mewbrew_contact_actions') || '[]');
        actions.push({
            action: action,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('mewbrew_contact_actions', JSON.stringify(actions));
    }

    getClientIP() {
        // Simplified version - in real app, get from server
        return 'simulated_ip_' + Math.random().toString(36).substr(2, 9);
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.contact-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `contact-alert alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '1056';
        alertDiv.style.width = '90%';
        alertDiv.style.maxWidth = '500px';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    showToast(message, type = 'success') {
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type} border-0" id="${toastId}" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Add to container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = this.createToastContainer();
        }
        container.insertAdjacentHTML('beforeend', toastHtml);
        
        // Show toast
        const toastElement = document.getElementById(toastId);
        if (!toastElement) return;
        
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Remove after hide
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }
}