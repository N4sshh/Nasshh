// cats.js - Enhanced functionality for MewBrew Café Cats Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cats system
    const catsSystem = new CatsSystem();
    catsSystem.init();
});

class CatsSystem {
    constructor() {
        // DOM Elements
        this.catCards = document.querySelectorAll('.cat-card');
        this.adoptionForm = document.querySelector('.adoption-form');
        this.catSelect = document.getElementById('cat');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        
        // Summary elements
        this.summaryGuests = document.getElementById('summary-guests');
        this.summaryRate = document.getElementById('summary-rate');
        this.summaryTotal = document.getElementById('summary-total');
        
        // Cats data (in a real app, this would come from an API)
        this.catsData = [
            {
                id: 'luna',
                name: 'Luna',
                age: '3 years',
                color: 'Gray & White',
                personality: 'Gentle',
                description: 'Luna is a calm and affectionate cat who loves being petted and will often curl up next to you. She gets along well with other cats.',
                status: 'available',
                featured: true,
                visits: 42,
                favoriteToy: 'Feather wand'
            },
            {
                id: 'whiskers',
                name: 'Whiskers',
                age: '2 years',
                color: 'Orange Tabby',
                personality: 'Playful',
                description: 'Whiskers is an energetic and curious cat who loves chasing toys and exploring. He\'s very social and enjoys playing.',
                status: 'available',
                featured: true,
                visits: 38,
                favoriteToy: 'Laser pointer'
            },
            {
                id: 'mochi',
                name: 'Mochi',
                age: '1 year',
                color: 'Calico',
                personality: 'Curious',
                description: 'Mochi is a young, curious cat who loves exploring and climbing. She\'s very intelligent and enjoys puzzle toys.',
                status: 'pending',
                featured: false,
                visits: 25,
                favoriteToy: 'Puzzle feeder'
            },
            {
                id: 'simba',
                name: 'Simba',
                age: '4 years',
                color: 'Ginger',
                personality: 'Relaxed',
                description: 'Simba is a laid-back cat who enjoys lounging in sunny spots. He\'s very affectionate and will happily sit on your lap.',
                status: 'available',
                featured: true,
                visits: 31,
                favoriteToy: 'Cozy bed'
            }
        ];
        
        // Adoption inquiries counter
        this.adoptionInquiries = JSON.parse(localStorage.getItem('mewbrew_adoption_inquiries') || '[]');
        
        // Tooltip timeout reference
        this.tooltipTimeout = null;
    }

    init() {
        this.setupCatCards();
        this.setupAdoptionForm();
        this.setupFilters();
        this.updateStats();
        
        console.log('MewBrew Cats System initialized');
    }

    setupCatCards() {
        // Add interactive features to cat cards
        this.catCards.forEach(card => {
            const catName = card.querySelector('.card-title').textContent.trim().toLowerCase();
            const catData = this.catsData.find(cat => cat.name.toLowerCase() === catName);
            
            if (!catData) return;
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease';
                
                // Show tooltip after a short delay
                this.tooltipTimeout = setTimeout(() => {
                    this.showCatTooltip(card, catData);
                }, 500);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                
                // Clear tooltip timeout
                if (this.tooltipTimeout) {
                    clearTimeout(this.tooltipTimeout);
                    this.tooltipTimeout = null;
                }
                
                this.hideCatTooltip();
            });
            
            // Add click to select for adoption
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.cat-status') && !e.target.closest('a')) {
                    this.selectCatForAdoption(catData);
                }
            });
            
            // Add favorite button
            this.addFavoriteButton(card, catData);
            
            // Add visit counter
            this.addVisitCounter(card, catData);
        });
    }

    showCatTooltip(card, catData) {
        // Remove existing tooltip
        const existingTooltip = document.querySelector('.cat-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'cat-tooltip card shadow-lg';
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.maxWidth = '300px';
        tooltip.style.display = 'none';
        
        tooltip.innerHTML = `
            <div class="card-body p-3">
                <h5 class="card-title mb-2">${catData.name}</h5>
                <div class="cat-stats mb-2">
                    <small class="text-muted me-3"><i class="fas fa-eye me-1"></i>${catData.visits} visits</small>
                    <small class="text-muted"><i class="fas fa-heart me-1"></i>${catData.favoriteToy}</small>
                </div>
                <p class="card-text mb-2">${catData.description}</p>
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-warning adopt-tooltip-btn" data-cat="${catData.id}">
                        <i class="fas fa-heart me-1"></i>Adopt
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = card.getBoundingClientRect();
        const tooltipWidth = 300;
        const tooltipHeight = tooltip.offsetHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate position
        let left = rect.left + rect.width/2 - tooltipWidth/2;
        let top = rect.top - tooltipHeight - 10;
        
        // Adjust if tooltip would go off screen
        if (left < 10) left = 10;
        if (left + tooltipWidth > viewportWidth - 10) left = viewportWidth - tooltipWidth - 10;
        if (top < 10) top = rect.bottom + 10; // Show below if not enough space above
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.display = 'block';
        
        // Add adopt button listener
        tooltip.querySelector('.adopt-tooltip-btn').addEventListener('click', () => {
            this.selectCatForAdoption(catData);
        });
    }

    hideCatTooltip() {
        const tooltip = document.querySelector('.cat-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    addFavoriteButton(card, catData) {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'cat-favorite-btn btn btn-sm btn-outline-warning position-absolute top-0 end-0 m-2';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.setAttribute('aria-label', `Favorite ${catData.name}`);
        
        // Check if already favorited
        const favorites = JSON.parse(localStorage.getItem('mewbrew_favorite_cats') || '[]');
        if (favorites.includes(catData.id)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart text-danger"></i>';
            favoriteBtn.classList.add('favorited');
        }
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(catData, favoriteBtn);
        });
        
        card.querySelector('.card-body').appendChild(favoriteBtn);
    }

    toggleFavorite(catData, button) {
        let favorites = JSON.parse(localStorage.getItem('mewbrew_favorite_cats') || '[]');
        
        if (favorites.includes(catData.id)) {
            // Remove from favorites
            favorites = favorites.filter(id => id !== catData.id);
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.classList.remove('favorited');
            this.showAlert(`Removed ${catData.name} from favorites`, 'info');
        } else {
            // Add to favorites
            favorites.push(catData.id);
            button.innerHTML = '<i class="fas fa-heart text-danger"></i>';
            button.classList.add('favorited');
            this.showAlert(`Added ${catData.name} to favorites!`, 'success');
        }
        
        localStorage.setItem('mewbrew_favorite_cats', JSON.stringify(favorites));
        
        // Update favorites count
        this.updateFavoritesCount();
    }

    addVisitCounter(card, catData) {
        const visitBadge = document.createElement('div');
        visitBadge.className = 'cat-visits badge bg-light text-dark position-absolute top-0 start-0 m-2';
        visitBadge.innerHTML = `<i class="fas fa-eye me-1"></i>${catData.visits}`;
        card.querySelector('.card-body').appendChild(visitBadge);
    }

    setupAdoptionForm() {
        if (!this.adoptionForm) return;
        
        // Form validation
        this.adoptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateAdoptionForm()) {
                this.submitAdoptionInquiry();
            }
        });
        
        // Real-time form validation
        this.nameInput?.addEventListener('input', this.validateField.bind(this));
        this.emailInput?.addEventListener('input', this.validateField.bind(this));
        this.phoneInput?.addEventListener('input', this.validateField.bind(this));
        this.catSelect?.addEventListener('change', this.validateField.bind(this));
        
        // Auto-fill based on URL parameter
        this.checkUrlForCatSelection();
    }

    validateAdoptionForm() {
        let isValid = true;
        
        // Basic validation
        if (!this.nameInput?.value.trim()) {
            this.showValidationError(this.nameInput, 'Please enter your name');
            isValid = false;
        }
        
        if (!this.emailInput?.value.trim() || !this.isValidEmail(this.emailInput.value)) {
            this.showValidationError(this.emailInput, 'Please enter a valid email');
            isValid = false;
        }
        
        if (!this.phoneInput?.value.trim()) {
            this.showValidationError(this.phoneInput, 'Please enter your phone number');
            isValid = false;
        }
        
        if (!this.catSelect?.value) {
            this.showValidationError(this.catSelect, 'Please select a cat');
            isValid = false;
        }
        
        // Additional validation for phone
        if (this.phoneInput?.value && !this.isValidPhone(this.phoneInput.value)) {
            this.showValidationError(this.phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Clear previous error
        this.clearValidationError(field);
        
        // Validate based on field type
        switch(field.id) {
            case 'name':
                if (value.length < 2) {
                    this.showValidationError(field, 'Name must be at least 2 characters');
                }
                break;
                
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showValidationError(field, 'Please enter a valid email address');
                }
                break;
                
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showValidationError(field, 'Please enter a valid phone number');
                }
                break;
                
            case 'cat':
                if (!value) {
                    this.showValidationError(field, 'Please select a cat');
                }
                break;
        }
    }

    showValidationError(field, message) {
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
            field.classList.add('is-invalid');
        }
    }

    clearValidationError(field) {
        field.classList.remove('is-invalid');
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation for PH numbers
        const re = /^[\d\s\-\+\(\)]{7,15}$/;
        return re.test(phone);
    }

    submitAdoptionInquiry() {
        // Show loading state
        const submitBtn = this.adoptionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            name: this.nameInput.value,
            email: this.emailInput.value,
            phone: this.phoneInput.value,
            cat: this.catSelect.value,
            catName: this.catSelect.options[this.catSelect.selectedIndex].text,
            experience: document.getElementById('experience')?.value || '',
            message: document.getElementById('message')?.value || '',
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Simulate API call
        setTimeout(() => {
            // Save to localStorage (for demo)
            this.adoptionInquiries.push(formData);
            localStorage.setItem('mewbrew_adoption_inquiries', JSON.stringify(this.adoptionInquiries));
            
            // Show success modal
            this.createAdoptionSuccessModal(formData);
            
            // Reset form
            this.adoptionForm.reset();
            this.adoptionForm.classList.remove('was-validated');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Update stats
            this.updateStats();
            
            console.log('Adoption inquiry submitted:', formData);
            
        }, 1500);
    }

    createAdoptionSuccessModal(inquiry) {
        // Create modal if it doesn't exist
        if (!document.getElementById('adoptionSuccessModal')) {
            const modalHTML = `
                <div class="modal fade" id="adoptionSuccessModal" tabindex="-1" aria-labelledby="adoptionSuccessModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header border-0">
                                <h5 class="modal-title text-center w-100" id="adoptionSuccessModalLabel">Adoption Inquiry Submitted!</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                                <i class="fas fa-cat fa-4x text-warning mb-3"></i>
                                <h4 class="mb-3">Thank You!</h4>
                                <div class="inquiry-details mb-3 p-3 bg-light rounded">
                                    <p class="mb-1"><strong>Cat:</strong> ${inquiry.catName}</p>
                                    <p class="mb-1"><strong>Submitted:</strong> ${new Date(inquiry.timestamp).toLocaleDateString()}</p>
                                    <p class="mb-0"><strong>Reference:</strong> ADOPT-${Date.now().toString().slice(-6)}</p>
                                </div>
                                <p class="mb-2">Your adoption inquiry has been submitted successfully.</p>
                                <p class="mb-0">We will contact you within 48 hours.</p>
                            </div>
                            <div class="modal-footer border-0 justify-content-center">
                                <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        // Update modal content
        const modalBody = document.querySelector('#adoptionSuccessModal .modal-body .inquiry-details');
        if (modalBody) {
            modalBody.innerHTML = `
                <p class="mb-1"><strong>Cat:</strong> ${inquiry.catName}</p>
                <p class="mb-1"><strong>Submitted:</strong> ${new Date(inquiry.timestamp).toLocaleDateString()}</p>
                <p class="mb-0"><strong>Reference:</strong> ADOPT-${Date.now().toString().slice(-6)}</p>
            `;
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('adoptionSuccessModal'));
        modal.show();
    }

    setupFilters() {
        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'cat-filters mb-4 text-center';
        filterContainer.innerHTML = `
            <h3 class="h5 mb-3">Filter Cats</h3>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-warning active" data-filter="all">All</button>
                <button type="button" class="btn btn-outline-warning" data-filter="available">Available</button>
                <button type="button" class="btn btn-outline-warning" data-filter="pending">Pending</button>
                <button type="button" class="btn btn-outline-warning" data-filter="favorites">Favorites</button>
            </div>
        `;
        
        // Insert before cats gallery
        const gallery = document.querySelector('.cats-gallery');
        if (gallery) {
            gallery.insertBefore(filterContainer, gallery.querySelector('.row'));
            
            // Add filter functionality
            filterContainer.querySelectorAll('button[data-filter]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update active button
                    filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Filter cats
                    this.filterCats(e.target.dataset.filter);
                });
            });
        }
    }

    filterCats(filter) {
        const favorites = JSON.parse(localStorage.getItem('mewbrew_favorite_cats') || '[]');
        
        this.catCards.forEach(card => {
            const catName = card.querySelector('.card-title').textContent.trim().toLowerCase();
            const catData = this.catsData.find(cat => cat.name.toLowerCase() === catName);
            const statusElement = card.querySelector('.cat-status');
            const isAvailable = statusElement?.classList.contains('available');
            const isPending = statusElement?.classList.contains('pending');
            const isFavorited = favorites.includes(catData?.id);
            
            let show = false;
            
            switch(filter) {
                case 'all':
                    show = true;
                    break;
                case 'available':
                    show = isAvailable;
                    break;
                case 'pending':
                    show = isPending;
                    break;
                case 'favorites':
                    show = isFavorited;
                    break;
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    selectCatForAdoption(catData) {
        if (catData.status === 'available') {
            // Scroll to form
            document.querySelector('.adoption-form').scrollIntoView({ behavior: 'smooth' });
            
            // Auto-select cat in dropdown
            if (this.catSelect) {
                this.catSelect.value = catData.id;
                this.validateField({ target: this.catSelect });
            }
            
            // Highlight the cat card
            this.highlightCatCard(catData.name);
            
            this.showAlert(`Selected ${catData.name} for adoption!`, 'success');
        } else if (catData.status === 'pending') {
            this.showAlert(`${catData.name} already has a pending adoption application`, 'warning');
        }
    }

    highlightCatCard(catName) {
        // Remove previous highlights
        this.catCards.forEach(card => {
            card.classList.remove('selected-for-adoption');
        });
        
        // Find and highlight selected cat
        this.catCards.forEach(card => {
            if (card.querySelector('.card-title').textContent.trim() === catName) {
                card.classList.add('selected-for-adoption');
                
                // Scroll to card if not in view
                const rect = card.getBoundingClientRect();
                if (rect.top < 0 || rect.bottom > window.innerHeight) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    checkUrlForCatSelection() {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        
        if (catParam && this.catSelect) {
            const catOption = Array.from(this.catSelect.options).find(opt => opt.value === catParam);
            if (catOption) {
                this.catSelect.value = catParam;
                
                // Find and highlight the cat
                const catData = this.catsData.find(cat => cat.id === catParam);
                if (catData) {
                    setTimeout(() => this.highlightCatCard(catData.name), 500);
                }
            }
        }
    }

    updateStats() {
        // Update adoption stats
        const statsElement = document.createElement('div');
        statsElement.className = 'cat-stats text-center mb-4';
        
        const totalCats = this.catsData.length;
        const availableCats = this.catsData.filter(cat => cat.status === 'available').length;
        const totalInquiries = this.adoptionInquiries.length;
        
        statsElement.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="stat-box p-3 bg-light rounded">
                        <h4 class="stat-number">${totalCats}</h4>
                        <p class="stat-label mb-0">Total Cats</p>
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="stat-box p-3 bg-light rounded">
                        <h4 class="stat-number">${availableCats}</h4>
                        <p class="stat-label mb-0">Available for Adoption</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-box p-3 bg-light rounded">
                        <h4 class="stat-number">${totalInquiries}</h4>
                        <p class="stat-label mb-0">Adoption Inquiries</p>
                    </div>
                </div>
            </div>
        `;
        
        // Insert stats after intro
        const intro = document.querySelector('.cats-intro');
        if (intro && !document.querySelector('.cat-stats')) {
            intro.insertAdjacentElement('afterend', statsElement);
        }
    }

    updateFavoritesCount() {
        const favorites = JSON.parse(localStorage.getItem('mewbrew_favorite_cats') || '[]');
        const favoriteBadge = document.querySelector('.favorites-count');
        
        if (favoriteBadge) {
            favoriteBadge.textContent = favorites.length;
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.cats-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `cats-alert alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
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
}