// menu.js - Enhanced functionality for MewBrew Café Menu Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu system
    const menuSystem = new MenuSystem();
    menuSystem.init();
});

class MenuSystem {
    constructor() {
        // DOM Elements
        this.menuItems = document.querySelectorAll('.menu-item');
        this.orderButtons = document.querySelectorAll('.order-btn');
        this.cartIcon = document.querySelector('.cart-icon');
        this.cartCount = document.querySelector('.cart-count');
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartSummary = document.getElementById('cart-summary');
        this.checkoutModal = document.getElementById('checkoutModal');
        
        // Cart data
        this.cart = JSON.parse(localStorage.getItem('mewbrew_cart')) || [];
        this.cartTotal = 0;
        
        // Menu data
        this.menuData = [
            // Coffee & Espresso
            {
                id: 'espresso',
                name: 'Espresso',
                price: 100,
                category: 'coffee',
                tags: ['Hot', 'Strong'],
                description: 'Strong, rich coffee served in a small cup',
                image: 'images/menu/espresso.jpg',
                rating: 4.5,
                favorites: 120,
                available: true
            },
            {
                id: 'cappuccino',
                name: 'Cappuccino',
                price: 130,
                category: 'coffee',
                tags: ['Foamy', 'Classic'],
                description: 'Equal parts espresso, steamed milk, and milk foam',
                image: 'images/menu/cappuccino.jpg',
                rating: 4.7,
                favorites: 150,
                available: true
            },
            {
                id: 'latte',
                name: 'Latte',
                price: 140,
                category: 'coffee',
                tags: ['Creamy', 'Mild'],
                description: 'Espresso with steamed milk and a light foam layer',
                image: 'images/menu/latte.jpg',
                rating: 4.6,
                favorites: 180,
                available: true
            },
            {
                id: 'mocha',
                name: 'Mocha',
                price: 150,
                category: 'coffee',
                tags: ['Chocolate', 'Sweet'],
                description: 'Chocolate-infused espresso with steamed milk',
                image: 'images/menu/mocha.jpg',
                rating: 4.8,
                favorites: 200,
                available: true
            },
            // Pastries & Desserts
            {
                id: 'croissant',
                name: 'Croissant',
                price: 80,
                category: 'pastry',
                tags: ['Buttery', 'Fresh'],
                description: 'Buttery, flaky pastry made with layered dough',
                image: 'images/menu/croissant.jpg',
                rating: 4.4,
                favorites: 90,
                available: true
            },
            {
                id: 'chocolate-muffin',
                name: 'Chocolate Muffin',
                price: 90,
                category: 'pastry',
                tags: ['Chocolate', 'Moist'],
                description: 'Rich chocolate muffin with chocolate chips',
                image: 'images/menu/chocolate-muffin.jpg',
                rating: 4.5,
                favorites: 110,
                available: true
            },
            {
                id: 'blueberry-scone',
                name: 'Blueberry Scone',
                price: 85,
                category: 'pastry',
                tags: ['Fruity', 'Crumbly'],
                description: 'Freshly baked scone with blueberries',
                image: 'images/menu/blueberry-scone.jpg',
                rating: 4.3,
                favorites: 85,
                available: true
            },
            {
                id: 'cat-cookie',
                name: 'Cat-shaped Cookie',
                price: 60,
                category: 'pastry',
                tags: ['Cute', 'Vanilla'],
                description: 'Adorable vanilla cookie in the shape of a cat',
                image: 'images/menu/cat-cookie.jpg',
                rating: 4.6,
                favorites: 160,
                available: true
            },
            // Non-Coffee Drinks
            {
                id: 'fruit-tea',
                name: 'Fruit Tea',
                price: 110,
                category: 'non-coffee',
                tags: ['Fruity', 'Refreshing'],
                description: 'Refreshing tea with natural fruit flavors',
                image: 'images/menu/fruit-tea.jpg',
                rating: 4.4,
                favorites: 95,
                available: true
            },
            {
                id: 'hot-chocolate',
                name: 'Hot Chocolate',
                price: 120,
                category: 'non-coffee',
                tags: ['Creamy', 'Chocolate'],
                description: 'Rich, creamy chocolate drink with whipped cream',
                image: 'images/menu/hot-chocolate.jpg',
                rating: 4.7,
                favorites: 140,
                available: true
            },
            {
                id: 'iced-lemonade',
                name: 'Iced Lemonade',
                price: 95,
                category: 'non-coffee',
                tags: ['Refreshing', 'Cold'],
                description: 'Freshly squeezed lemonade with mint',
                image: 'images/menu/lemonade.jpg',
                rating: 4.3,
                favorites: 80,
                available: true
            },
            {
                id: 'matcha-latte',
                name: 'Matcha Latte',
                price: 135,
                category: 'non-coffee',
                tags: ['Green Tea', 'Healthy'],
                description: 'Japanese green tea with steamed milk',
                image: 'images/menu/matcha-latte.jpg',
                rating: 4.5,
                favorites: 120,
                available: true
            }
        ];
        
        // Service fee percentage
        this.serviceFeePercent = 0.05;
        
        // Order history
        this.orderHistory = JSON.parse(localStorage.getItem('mewbrew_order_history')) || [];
    }

    init() {
        this.setupMenuItems();
        this.setupCart();
        this.setupCheckoutModal();
        this.setupFilters();
        this.setupSearch();
        this.updateCartCount();
        
        console.log('MewBrew Menu System initialized');
    }

    setupMenuItems() {
        this.menuItems.forEach((item, index) => {
            const menuData = this.menuData[index];
            if (!menuData) return;
            
            // Add data attributes
            item.setAttribute('data-item-id', menuData.id);
            item.setAttribute('data-item-category', menuData.category);
            
            // Add click for details
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('order-btn') && 
                    !e.target.closest('.order-btn') &&
                    !e.target.closest('button')) {
                    this.showItemDetails(menuData);
                }
            });
            
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
                item.style.transition = 'transform 0.3s ease';
                
                const priceBadge = item.querySelector('.price-badge');
                if (priceBadge) {
                    priceBadge.style.transform = 'scale(1.1)';
                    priceBadge.style.transition = 'transform 0.3s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                const priceBadge = item.querySelector('.price-badge');
                if (priceBadge) {
                    priceBadge.style.transform = 'scale(1)';
                }
            });
            
            // Update order button
            const orderBtn = item.querySelector('.order-btn');
            if (orderBtn) {
                orderBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addToCart(menuData);
                });
            }
            
            // Add favorite button
            this.addFavoriteButton(item, menuData);
            
            // Add rating display
            this.addRatingDisplay(item, menuData);
        });
    }

    addFavoriteButton(item, menuData) {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2';
        favoriteBtn.setAttribute('aria-label', `Favorite ${menuData.name}`);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        
        // Check if already favorited
        const favorites = JSON.parse(localStorage.getItem('mewbrew_favorites')) || [];
        if (favorites.includes(menuData.id)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.classList.add('favorited');
        }
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(menuData, favoriteBtn);
        });
        
        item.querySelector('.card-body').appendChild(favoriteBtn);
    }

    toggleFavorite(menuData, button) {
        let favorites = JSON.parse(localStorage.getItem('mewbrew_favorites')) || [];
        
        if (favorites.includes(menuData.id)) {
            // Remove from favorites
            favorites = favorites.filter(id => id !== menuData.id);
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.classList.remove('favorited');
            this.showNotification(`Removed ${menuData.name} from favorites`, 'info');
        } else {
            // Add to favorites
            favorites.push(menuData.id);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.classList.add('favorited');
            this.showNotification(`Added ${menuData.name} to favorites!`, 'success');
            
            // Animation
            button.style.animation = 'pulse 0.5s';
            setTimeout(() => button.style.animation = '', 500);
        }
        
        localStorage.setItem('mewbrew_favorites', JSON.stringify(favorites));
    }

    addRatingDisplay(item, menuData) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'item-rating mt-2';
        ratingDiv.innerHTML = `
            <div class="d-flex align-items-center small">
                <div class="stars me-2">
                    ${this.getStarRating(menuData.rating)}
                </div>
                <span class="text-muted">(${menuData.favorites})</span>
            </div>
        `;
        
        item.querySelector('.card-body').appendChild(ratingDiv);
    }

    getStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }
        
        return stars;
    }

    showItemDetails(menuData) {
        // Create modal if doesn't exist
        let modal = document.getElementById('itemDetailsModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'itemDetailsModal';
            modal.tabIndex = '-1';
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">${menuData.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="itemDetailsContent">
                                <!-- Content will be loaded here -->
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-warning add-to-cart-modal-btn">
                                <i class="fas fa-plus me-2"></i>Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Populate content
        const content = modal.querySelector('#itemDetailsContent');
        content.innerHTML = `
            <div class="item-details">
                <div class="text-center mb-4">
                    <img src="${menuData.image}" alt="${menuData.name}" class="img-fluid rounded mb-3" style="max-height: 200px;">
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted">Description</h6>
                        <p>${menuData.description}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Details</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="fas fa-tag me-2 text-warning"></i>₱${menuData.price}</li>
                            <li class="mb-2"><i class="fas fa-star me-2 text-warning"></i>${menuData.rating}/5 (${menuData.favorites} favorites)</li>
                            <li class="mb-2">
                                <i class="fas fa-tags me-2 text-warning"></i>
                                ${menuData.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('')}
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-${menuData.available ? 'check' : 'times'} me-2 ${menuData.available ? 'text-success' : 'text-danger'}"></i>
                                ${menuData.available ? 'Available' : 'Currently Unavailable'}
                            </li>
                        </ul>
                    </div>
                </div>
                
                ${menuData.category === 'coffee' ? `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Customization:</strong> Available options: Extra shot (+₱20), Soy milk (+₱15), Sugar-free syrup (+₱10)
                    </div>
                ` : ''}
                
                ${menuData.category === 'pastry' ? `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Note:</strong> Contains gluten. Gluten-free options available upon request.
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add event listener to modal's add to cart button
        const addBtn = modal.querySelector('.add-to-cart-modal-btn');
        addBtn.onclick = () => {
            this.addToCart(menuData);
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal.hide();
        };
        
        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    setupCart() {
        // Initialize cart from localStorage
        this.updateCartDisplay();
        
        // Setup cart toggle
        this.cartIcon?.addEventListener('click', () => {
            this.toggleCart();
        });
        
        // Setup overlay click
        document.querySelector('.cart-overlay')?.addEventListener('click', () => {
            this.toggleCart();
        });
        
        // Setup close button
        document.querySelector('.cart-sidebar .btn-outline-secondary')?.addEventListener('click', () => {
            this.toggleCart();
        });
    }

    addToCart(menuData) {
        if (!menuData.available) {
            this.showNotification(`${menuData.name} is currently unavailable`, 'warning');
            return;
        }
        
        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.id === menuData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: menuData.id,
                name: menuData.name,
                price: menuData.price,
                quantity: 1,
                category: menuData.category
            });
        }
        
        // Save to localStorage
        localStorage.setItem('mewbrew_cart', JSON.stringify(this.cart));
        
        // Update display
        this.updateCartCount();
        this.updateCartDisplay();
        
        // Show notification
        this.showNotification(`${menuData.name} added to cart!`, 'success');
        
        // Animation on cart icon
        this.animateCartIcon();
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem('mewbrew_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        if (this.cart[index].quantity <= 0) {
            this.cart.splice(index, 1);
        }
        
        localStorage.setItem('mewbrew_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateCartCount() {
        if (!this.cartCount) return;
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        // Add animation if count changed
        if (totalItems > 0) {
            this.cartCount.classList.add('updated');
            setTimeout(() => this.cartCount.classList.remove('updated'), 300);
        }
    }

    updateCartDisplay() {
        if (!this.cartItemsContainer) return;
        
        // Clear current cart display
        this.cartItemsContainer.innerHTML = '';
        
        if (this.cart.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                    <p>Your cart is empty</p>
                    <p>Add some delicious items from our menu!</p>
                </div>
            `;
            this.cartSummary.style.display = 'none';
            return;
        }
        
        // Calculate totals
        let subtotal = 0;
        
        // Add each item to cart display
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="mb-0 text-muted">₱${item.price} each</p>
                    </div>
                    <span class="fw-bold">₱${itemTotal}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            this.cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to new buttons
        this.cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const action = e.target.dataset.action;
                this.updateQuantity(index, action === 'increase' ? 1 : -1);
            });
        });
        
        this.cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeFromCart(index);
            });
        });
        
        // Update totals
        const serviceFee = subtotal * this.serviceFeePercent;
        const total = subtotal + serviceFee;
        this.cartTotal = total;
        
        document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
        document.getElementById('service-fee').textContent = `₱${serviceFee.toFixed(2)}`;
        document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
        
        // Show cart summary
        this.cartSummary.style.display = 'block';
    }

    animateCartIcon() {
        if (!this.cartIcon) return;
        
        this.cartIcon.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            this.cartIcon.style.animation = '';
        }, 500);
    }

    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('active');
        
        // Update cart display when opening
        if (cartSidebar.classList.contains('open')) {
            this.updateCartDisplay();
        }
    }

    setupCheckoutModal() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showCheckoutModal();
            });
        }
        
        // Setup checkout form submission
        document.querySelector('#checkoutModal .btn-warning')?.addEventListener('click', () => {
            this.submitOrder();
        });
    }

    showCheckoutModal() {
        // Close cart sidebar
        this.toggleCart();
        
        // Update modal with current cart
        const modalCartItems = document.getElementById('modal-cart-items');
        if (!modalCartItems) return;
        
        modalCartItems.innerHTML = '';
        
        this.cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between mb-2';
            itemElement.innerHTML = `
                <span>${item.quantity}x ${item.name}</span>
                <span>₱${(item.price * item.quantity).toFixed(2)}</span>
            `;
            modalCartItems.appendChild(itemElement);
        });
        
        document.getElementById('modal-total').textContent = `₱${this.cartTotal.toFixed(2)}`;
        
        // Set default time to now + 30 minutes
        const timeInput = document.getElementById('preferredTime');
        if (timeInput) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30);
            timeInput.value = now.toISOString().slice(0, 16);
        }
        
        // Show modal
        const modal = new bootstrap.Modal(this.checkoutModal);
        modal.show();
    }

    submitOrder() {
        // Get form data
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone')?.value;
        const orderType = document.getElementById('orderType')?.value;
        const instructions = document.getElementById('specialInstructions')?.value;
        const preferredTime = document.getElementById('preferredTime')?.value;
        const terms = document.getElementById('terms')?.checked;
        
        // Validate form
        if (!name || !email || !phone) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        if (!terms) {
            this.showNotification('Please agree to the terms and conditions', 'warning');
            return;
        }
        
        // Validate email
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        // Validate phone
        if (!this.isValidPhone(phone)) {
            this.showNotification('Please enter a valid phone number', 'warning');
            return;
        }
        
        // Create order object
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-8),
            customer: {
                name: name,
                email: email,
                phone: phone
            },
            items: [...this.cart],
            details: {
                type: orderType,
                instructions: instructions,
                preferredTime: preferredTime,
                subtotal: this.cartTotal / (1 + this.serviceFeePercent),
                serviceFee: this.cartTotal * this.serviceFeePercent,
                total: this.cartTotal
            },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save to order history
        this.orderHistory.push(order);
        localStorage.setItem('mewbrew_order_history', JSON.stringify(this.orderHistory));
        
        // Clear cart
        this.cart = [];
        localStorage.setItem('mewbrew_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartDisplay();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(this.checkoutModal);
        modal.hide();
        
        // Reset form
        document.getElementById('orderForm').reset();
        
        // Show success modal
        this.showOrderSuccessModal(order);
        
        // Send confirmation (simulated)
        this.sendOrderConfirmation(order);
    }

    showOrderSuccessModal(order) {
        // Create success modal
        const modalId = 'orderSuccessModal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.tabIndex = '-1';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title text-success"><i class="fas fa-check-circle me-2"></i>Order Confirmed!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <i class="fas fa-coffee fa-4x text-warning mb-3"></i>
                        <h4 class="mb-3">Thank You for Your Order!</h4>
                        <div class="order-details mb-3 p-3 bg-light rounded">
                            <p class="mb-1"><strong>Order ID:</strong> ${order.id}</p>
                            <p class="mb-1"><strong>Total:</strong> ₱${order.details.total.toFixed(2)}</p>
                            <p class="mb-1"><strong>Type:</strong> ${order.details.type}</p>
                            ${order.details.preferredTime ? 
                                `<p class="mb-0"><strong>Preferred Time:</strong> ${new Date(order.details.preferredTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>` : 
                                ''
                            }
                        </div>
                        <p class="mb-0">Your order has been received and is being prepared. We'll send a confirmation email shortly.</p>
                        <button class="btn btn-sm btn-outline-warning mt-3 copy-order-id" data-order-id="${order.id}">
                            <i class="fas fa-copy me-1"></i>Copy Order ID
                        </button>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Add copy order ID functionality
        modal.querySelector('.copy-order-id')?.addEventListener('click', (e) => {
            const orderId = e.target.dataset.orderId;
            navigator.clipboard.writeText(orderId).then(() => {
                this.showNotification('Order ID copied to clipboard!', 'success');
            });
        });
    }

    sendOrderConfirmation(order) {
        console.log('Order confirmation sent for:', order.id);
        // In a real app, this would send an email via your backend
    }

    setupFilters() {
        // Create filter buttons
        this.addCategoryFilters();
    }

    addCategoryFilters() {
        const menuContainer = document.querySelector('.menu-container');
        if (!menuContainer) return;
        
        const filterDiv = document.createElement('div');
        filterDiv.className = 'menu-filters mb-5';
        filterDiv.innerHTML = `
            <div class="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                <span class="fw-bold">Filter by:</span>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-warning active" data-filter="all">All Items</button>
                    <button type="button" class="btn btn-outline-warning" data-filter="coffee">Coffee</button>
                    <button type="button" class="btn btn-outline-warning" data-filter="pastry">Pastries</button>
                    <button type="button" class="btn btn-outline-warning" data-filter="non-coffee">Non-Coffee</button>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="availableOnly">
                    <label class="form-check-label" for="availableOnly">Available Only</label>
                </div>
            </div>
        `;
        
        const firstCategory = document.querySelector('.menu-category');
        if (firstCategory) {
            menuContainer.insertBefore(filterDiv, firstCategory);
        }
        
        // Add filter functionality
        filterDiv.querySelectorAll('button[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterDiv.querySelectorAll('button[data-filter]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.filterMenuItems(e.target.dataset.filter);
            });
        });
        
        // Add availability filter
        const availableCheckbox = document.getElementById('availableOnly');
        availableCheckbox.addEventListener('change', () => {
            const activeFilter = filterDiv.querySelector('button[data-filter].active').dataset.filter;
            this.filterMenuItems(activeFilter);
        });
    }

    filterMenuItems(filterType) {
        const showAvailableOnly = document.getElementById('availableOnly').checked;
        
        this.menuItems.forEach((item, index) => {
            const menuData = this.menuData[index];
            if (!menuData) return;
            
            let show = true;
            
            // Filter by category
            if (filterType !== 'all') {
                show = show && menuData.category === filterType;
            }
            
            // Filter by availability
            if (showAvailableOnly) {
                show = show && menuData.available;
            }
            
            // Show/hide category sections
            const categorySection = item.closest('.menu-category');
            if (categorySection) {
                const itemsInSection = categorySection.querySelectorAll('.menu-item');
                const visibleItems = Array.from(itemsInSection).filter(item => {
                    const itemIndex = Array.from(this.menuItems).indexOf(item);
                    const itemData = this.menuData[itemIndex];
                    if (!itemData) return false;
                    
                    let itemShow = true;
                    if (filterType !== 'all') itemShow = itemData.category === filterType;
                    if (showAvailableOnly) itemShow = itemShow && itemData.available;
                    return itemShow;
                });
                
                // Show/hide entire category section
                categorySection.style.display = visibleItems.length > 0 ? 'block' : 'none';
            }
            
            // Show/hide individual item
            item.style.display = show ? 'block' : 'none';
        });
    }

    setupSearch() {
        // Add search functionality
        this.addSearchBar();
    }

    addSearchBar() {
        const menuContainer = document.querySelector('.menu-container');
        if (!menuContainer) return;
        
        const searchDiv = document.createElement('div');
        searchDiv.className = 'menu-search mb-4';
        searchDiv.innerHTML = `
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input type="search" class="form-control" placeholder="Search menu items..." id="menuSearch">
                <button class="btn btn-outline-warning" type="button" id="clearSearch">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const filters = document.querySelector('.menu-filters');
        if (filters) {
            menuContainer.insertBefore(searchDiv, filters);
        } else {
            const firstCategory = document.querySelector('.menu-category');
            if (firstCategory) {
                menuContainer.insertBefore(searchDiv, firstCategory);
            }
        }
        
        // Add search functionality
        const searchInput = document.getElementById('menuSearch');
        const clearBtn = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            this.searchMenuItems(query);
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            this.searchMenuItems('');
        });
    }

    searchMenuItems(query) {
        this.menuItems.forEach((item, index) => {
            const menuData = this.menuData[index];
            if (!menuData) return;
            
            let show = true;
            
            if (query) {
                const matches = menuData.name.toLowerCase().includes(query) ||
                               menuData.description.toLowerCase().includes(query) ||
                               menuData.tags.some(tag => tag.toLowerCase().includes(query));
                show = matches;
            }
            
            item.style.display = show ? 'block' : 'none';
        });
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]{7,15}$/;
        return re.test(phone);
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notificationId = 'notification-' + Date.now();
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification alert alert-${type} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.getElementById(notificationId)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS for animations and styles
const style = document.createElement('style');
style.textContent = `
    /* Cart icon animation */
    .cart-count.updated {
        animation: bounce 0.3s;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    /* Menu item animations */
    .menu-item {
        transition: all 0.3s ease;
    }
    
    .menu-item:hover {
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    
    .price-badge {
        transition: transform 0.3s ease;
    }
    
    /* Favorite button */
    .favorite-btn {
        opacity: 0.8;
        transition: all 0.3s ease;
    }
    
    .favorite-btn:hover {
        opacity: 1;
        transform: scale(1.1);
    }
    
    .favorite-btn.favorited {
        opacity: 1;
    }
    
    /* Rating stars */
    .stars {
        color: #ff9800;
    }
    
    /* Filter buttons */
    .menu-filters .btn-outline-warning.active {
        background-color: #ff9800;
        color: white;
        border-color: #ff9800;
    }
    
    /* Cart animations */
    .cart-item {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Notification animations */
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .menu-filters,
        .menu-search {
            flex-direction: column;
            gap: 10px !important;
        }
        
        .menu-filters .btn-group {
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .menu-filters .btn {
            margin-bottom: 5px;
        }
    }
`;
document.head.appendChild(style);

// Make menuSystem available globally for onclick handlers in HTML
window.menuSystem = null;
document.addEventListener('DOMContentLoaded', function() {
    window.menuSystem = new MenuSystem();
    window.menuSystem.init();
});

// Global functions for onclick handlers in HTML
window.addToCart = function(itemName, price) {
    if (!window.menuSystem) return;
    
    const menuData = window.menuSystem.menuData.find(item => item.name === itemName);
    if (menuData) {
        window.menuSystem.addToCart(menuData);
    }
};

window.toggleCart = function() {
    if (window.menuSystem) {
        window.menuSystem.toggleCart();
    }
};

window.showCheckoutModal = function() {
    if (window.menuSystem) {
        window.menuSystem.showCheckoutModal();
    }
};