// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Get cart count element (present on all pages)
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // Update cart count display
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        let totalCount = 0;
        
        cart.forEach(item => {
            totalCount += item.quantity;
        });
        
        cartCountElements.forEach(element => {
            element.textContent = totalCount;
        });
    }

    // Update cart count on page load
    updateCartCount();

    // Add to cart buttons (on shop page)
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                let cart = JSON.parse(localStorage.getItem('cart'));
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.name === name);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                // Show confirmation
                alert(`${name} has been added to your cart!`);
            });
        });
    }

    // Cart page specific functionality
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer && cartTotalElement) {
        function renderCart() {
            const cart = JSON.parse(localStorage.getItem('cart'));
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';
                cartTotalElement.textContent = 'bwp0.00';
                return;
            }
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">bwp${item.price.toFixed(2)} x ${item.quantity}</div>
                        <button class="remove-item" data-name="${item.name}">Remove</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            cartTotalElement.textContent = `bwp${total.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemName = this.getAttribute('data-name');
                    let cart = JSON.parse(localStorage.getItem('cart'));
                    
                    cart = cart.filter(item => item.name !== itemName);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    renderCart();
                    updateCartCount();
                });
            });
        }
        
        // Initial render
        renderCart();
        
        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                const cart = JSON.parse(localStorage.getItem('cart'));
                if (cart.length === 0) {
                    e.preventDefault();
                    alert('Your cart is empty. Please add items before checking out.');
                }
            });
        }
    }
});