// shop.js - Enhanced functionality for MewBrew Café Shop Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shop system
    const shopSystem = new ShopSystem();
    shopSystem.init();
    window.shopSystem = shopSystem;
});

class ShopSystem {
    constructor() {
        // Cart data
        this.cart = JSON.parse(localStorage.getItem('mewbrew_shop_cart')) || [];
        
        // Shipping cost
        this.shippingCost = 100;
        
        // Free shipping threshold
        this.freeShippingThreshold = 1000;
        
        // Support percentage
        this.supportPercentage = 20;
        
        // Initialize DOM references
        this.initDOMReferences();
    }

    initDOMReferences() {
        // Cart elements
        this.cartCount = document.getElementById('cartCount');
        this.cartItemsContainer = document.getElementById('cartItemsContainer');
        this.cartSubtotal = document.getElementById('cartSubtotal');
        this.cartShipping = document.getElementById('cartShipping');
        this.cartTotal = document.getElementById('cartTotal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        this.cartModal = document.getElementById('cartModal');
        this.checkoutModal = document.getElementById('checkoutModal');
        this.successModal = document.getElementById('successModal');
        this.checkoutForm = document.getElementById('checkoutForm');
        this.cartToggle = document.querySelector('.cart-toggle');
    }

    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
        
        console.log('MewBrew Shop System initialized');
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productElement = e.target.closest('.add-to-cart');
                const productName = productElement.getAttribute('data-product');
                const price = parseInt(productElement.getAttribute('data-price'));
                
                this.addProductToCart(productName, price);
                this.showNotification(`${productName} added to cart!`, 'success');
                this.animateCartButton();
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterProducts(filter);
            });
        });

        // Cart modal show event
        if (this.cartModal) {
            this.cartModal.addEventListener('show.bs.modal', () => {
                this.updateCartModal();
            });
            
            this.cartModal.addEventListener('hidden.bs.modal', () => {
                // Reset any temporary states
            });
        }

        // Cart toggle button
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => {
                const cartModal = new bootstrap.Modal(this.cartModal);
                cartModal.show();
            });
        }

        // Checkout button in cart modal
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.cart.length === 0) {
                    this.showNotification('Your cart is empty!', 'warning');
                    return;
                }
                
                const cartModal = bootstrap.Modal.getInstance(this.cartModal);
                if (cartModal) cartModal.hide();
                
                // Update checkout modal before showing
                this.updateCheckoutModal();
                
                const checkoutModal = new bootstrap.Modal(this.checkoutModal);
                setTimeout(() => {
                    checkoutModal.show();
                }, 300); // Small delay for modal transition
            });
        }

        // Checkout form submission
        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }

        // Shipping method change
        document.querySelectorAll('input[name="shippingMethod"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateCheckoutModal();
                
                // Show/hide address field based on selection
                const addressField = document.getElementById('checkoutAddress');
                const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
                if (shippingMethod && shippingMethod.value === 'delivery') {
                    addressField.required = true;
                    addressField.closest('.mb-3').style.display = 'block';
                } else {
                    addressField.required = false;
                    addressField.closest('.mb-3').style.display = 'none';
                }
            });
        });

        // Copy order ID button
        document.getElementById('copyOrderId')?.addEventListener('click', () => {
            const orderId = document.getElementById('orderId').textContent;
            navigator.clipboard.writeText(orderId).then(() => {
                this.showNotification('Order ID copied to clipboard!', 'success');
            });
        });

        // Continue shopping button
        document.getElementById('continueShopping')?.addEventListener('click', () => {
            const successModal = bootstrap.Modal.getInstance(this.successModal);
            if (successModal) successModal.hide();
        });
    }

    addProductToCart(productName, price) {
        const existingItemIndex = this.cart.findIndex(item => item.name === productName);
        
        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].quantity += 1;
        } else {
            this.cart.push({
                id: 'item-' + Date.now(),
                name: productName,
                price: price,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(itemId, change) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            this.cart[itemIndex].quantity += change;
            
            if (this.cart[itemIndex].quantity <= 0) {
                this.cart.splice(itemIndex, 1);
            }
            
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('mewbrew_shop_cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            if (totalItems > 0) {
                this.cartCount.style.display = 'flex';
                this.cartCount.classList.add('updated');
                setTimeout(() => this.cartCount.classList.remove('updated'), 300);
            } else {
                this.cartCount.style.display = 'none';
            }
        }
        
        // Update cart modal if open
        if (document.querySelector('.modal.show')?.id === 'cartModal') {
            this.updateCartModal();
        }
    }

    updateCartModal() {
        if (!this.cartItemsContainer) return;
        
        this.cartItemsContainer.innerHTML = '';
        
        if (this.cart.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="cart-empty text-center py-5">
                    <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <p class="small text-muted">Add some items to support cat rescue!</p>
                </div>
            `;
            
            if (this.cartSubtotal) this.cartSubtotal.textContent = '₱0';
            if (this.cartShipping) this.cartShipping.textContent = '₱0';
            if (this.cartTotal) this.cartTotal.textContent = '₱0';
            if (this.checkoutBtn) this.checkoutBtn.disabled = true;
            return;
        }
        
        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
        const total = subtotal + shipping;
        const supportAmount = (subtotal * this.supportPercentage) / 100;
        
        // Display cart items
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-6">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-warning">₱${item.price} each</small>
                    </div>
                    <div class="col-3">
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" onclick="window.shopSystem.updateQuantity('${item.id}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="window.shopSystem.updateQuantity('${item.id}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-3 text-end">
                        <span class="fw-bold">₱${itemTotal}</span>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="window.shopSystem.removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            this.cartItemsContainer.appendChild(cartItem);
        });
        
        // Add support amount display
        const supportDiv = document.createElement('div');
        supportDiv.className = 'row mt-2';
        supportDiv.innerHTML = `
            <div class="col-6">
                <small class="text-success">
                    <i class="fas fa-paw me-1"></i>Cat Rescue Support:
                </small>
            </div>
            <div class="col-6 text-end">
                <small class="text-success fw-bold">₱${supportAmount.toFixed(2)}</small>
            </div>
        `;
        this.cartItemsContainer.appendChild(supportDiv);
        
        // Update totals
        if (this.cartSubtotal) this.cartSubtotal.textContent = `₱${subtotal.toFixed(2)}`;
        if (this.cartShipping) {
            this.cartShipping.textContent = shipping === 0 ? 'Free!' : `₱${shipping.toFixed(2)}`;
            if (shipping === 0) {
                this.cartShipping.classList.add('text-success');
                this.cartShipping.classList.remove('text-muted');
            } else {
                this.cartShipping.classList.remove('text-success');
                this.cartShipping.classList.add('text-muted');
            }
        }
        if (this.cartTotal) this.cartTotal.textContent = `₱${total.toFixed(2)}`;
        if (this.checkoutBtn) this.checkoutBtn.disabled = false;
        
        // Free shipping message
        if (subtotal > 0 && subtotal < this.freeShippingThreshold) {
            const amountNeeded = this.freeShippingThreshold - subtotal;
            const freeShippingMsg = document.createElement('div');
            freeShippingMsg.className = 'alert alert-info alert-sm mt-3';
            freeShippingMsg.innerHTML = `
                <i class="fas fa-truck me-2"></i>
                Add ₱${amountNeeded.toFixed(2)} more for free shipping!
            `;
            this.cartItemsContainer.appendChild(freeShippingMsg);
        }
    }

    updateCheckoutModal() {
        if (!this.checkoutModal) return;
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
        const shipping = shippingMethod?.value === 'pickup' ? 0 : this.shippingCost;
        const total = subtotal + shipping;
        const supportAmount = (subtotal * this.supportPercentage) / 100;
        
        // Update checkout summary
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutShipping = document.getElementById('checkoutShipping');
        const checkoutTotal = document.getElementById('checkoutTotal');
        const checkoutSupport = document.getElementById('checkoutSupport');
        
        if (checkoutItems) checkoutItems.textContent = `₱${subtotal.toFixed(2)}`;
        if (checkoutShipping) {
            checkoutShipping.textContent = shipping === 0 ? 'Free!' : `₱${shipping.toFixed(2)}`;
        }
        if (checkoutTotal) checkoutTotal.textContent = `₱${total.toFixed(2)}`;
        if (checkoutSupport) checkoutSupport.textContent = `₱${supportAmount.toFixed(2)}`;
    }

    filterProducts(filter) {
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
            } else if (item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    processOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }
        
        // Validate form
        const name = document.getElementById('checkoutName')?.value;
        const email = document.getElementById('checkoutEmail')?.value;
        const phone = document.getElementById('checkoutPhone')?.value;
        const address = document.getElementById('checkoutAddress')?.value;
        const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
        
        if (!name || !email || !phone) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        // Check address requirement for delivery
        if (shippingMethod?.value === 'delivery' && !address) {
            this.showNotification('Please enter your delivery address', 'warning');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        if (!this.isValidPhone(phone)) {
            this.showNotification('Please enter a valid phone number', 'warning');
            return;
        }
        
        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = shippingMethod?.value === 'pickup' ? 0 : this.shippingCost;
        const total = subtotal + shipping;
        const supportAmount = (subtotal * this.supportPercentage) / 100;
        
        // Create order object
        const orderId = 'ORDER-' + Date.now().toString().slice(-8);
        const order = {
            id: orderId,
            customer: {
                name: name,
                email: email,
                phone: phone,
                address: shippingMethod?.value === 'delivery' ? address : 'Local Pickup',
                shippingMethod: shippingMethod?.value || 'pickup'
            },
            items: [...this.cart],
            totals: {
                subtotal: subtotal,
                shipping: shipping,
                supportAmount: supportAmount,
                total: total
            },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save order to localStorage (in a real app, this would go to a backend)
        const orders = JSON.parse(localStorage.getItem('mewbrew_shop_orders')) || [];
        orders.push(order);
        localStorage.setItem('mewbrew_shop_orders', JSON.stringify(orders));
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        
        // Close checkout modal
        const checkoutModal = bootstrap.Modal.getInstance(this.checkoutModal);
        if (checkoutModal) checkoutModal.hide();
        
        // Reset form
        if (this.checkoutForm) this.checkoutForm.reset();
        
        // Update success modal
        document.getElementById('orderId').textContent = orderId;
        document.getElementById('orderTotal').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('orderSupport').textContent = `₱${supportAmount.toFixed(2)}`;
        
        // Show success modal
        const successModal = new bootstrap.Modal(this.successModal);
        setTimeout(() => {
            successModal.show();
        }, 300);
        
        // Show notification
        this.showNotification('Order placed successfully!', 'success');
        
        // In a real app, you would send the order to your backend here
        console.log('Order placed:', order);
    }

    animateCartButton() {
        if (this.cartToggle) {
            this.cartToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.cartToggle.style.transform = 'scale(1)';
            }, 300);
        }
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification alert alert-${type} position-fixed`;
        notification.style.cssText = `
            top: 80px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]{7,15}$/;
        return re.test(phone);
    }
}

// Add minimal CSS for animations that are referenced in JS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .cart-count.updated {
        animation: bounce 0.3s;
    }
`;
document.head.appendChild(style);

// Global functions for onclick handlers
window.addToCart = function(productName, price) {
    if (window.shopSystem) {
        window.shopSystem.addProductToCart(productName, price);
        window.shopSystem.showNotification(`${productName} added to cart!`, 'success');
        window.shopSystem.animateCartButton();
    }
};

window.removeFromCart = function(itemId) {
    if (window.shopSystem) {
        window.shopSystem.removeFromCart(itemId);
    }
};

window.updateQuantity = function(itemId, change) {
    if (window.shopSystem) {
        window.shopSystem.updateQuantity(itemId, change);
    }
};