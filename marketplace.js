document.addEventListener('DOMContentLoaded', () => {
  console.log('marketplace.js loaded');

  // DOM Elements
  const cartItemsList = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout');
  const clearCartBtn = document.getElementById('clear-cart');
  const stripePayBtn = document.getElementById('stripe-pay');
  const xrplPayBtn = document.getElementById('xrpl-pay');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const products = document.querySelectorAll('.product, .bundle');
  const bundleSection = document.querySelector('.bundle-deals');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Countdown Timer for Limited Drops
  const countdownElements = document.querySelectorAll('.countdown');
  countdownElements.forEach(element => {
      const endTime = new Date(element.dataset.end).getTime();
      function updateCountdown() {
          const now = Date.now();
          const timeLeft = endTime - now;
          if (timeLeft <= 0) {
              element.innerHTML = 'Drop Ended';
              element.closest('.drop-item').querySelector('.pre-order').disabled = true;
              return;
          }
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          element.querySelector('span').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
  });

  // Add to Cart Functionality
  document.querySelectorAll('.add-to-cart, .add-bundle, .pre-order').forEach(button => {
      button.addEventListener('click', () => {
          const itemElement = button.closest('[data-id]');
          const sizeSelect = itemElement.querySelector('.size-select');
          const item = {
              id: itemElement.dataset.id,
              name: itemElement.querySelector('h3')?.textContent || 'Bundle',
              price: parseFloat(itemElement.dataset.price),
              size: sizeSelect ? sizeSelect.value : null, // Include size if present
              quantity: 1
          };
          const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
          if (existingItem) {
              existingItem.quantity++;
          } else {
              cart.push(item);
          }
          updateCartDisplay();
      });
  });

  // Category Filtering
  categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const selectedCategory = button.dataset.category;
          products.forEach(product => {
              product.style.display = (selectedCategory === 'all' || product.dataset.category === selectedCategory) ? 'block' : 'none';
          });
          bundleSection.style.display = (selectedCategory === 'all' || selectedCategory === 'bundles') ? 'block' : 'none';
      });
  });

  // Update Cart Display
  function updateCartDisplay() {
      cartItemsList.innerHTML = '';
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cart.forEach((item, index) => {
          const listItem = document.createElement('li');
          const sizeText = item.size ? ` (${item.size})` : '';
          listItem.innerHTML = `
              ${item.name}${sizeText} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
              <button class="remove-item" data-index="${index}">Remove</button>
          `;
          cartItemsList.appendChild(listItem);
      });
      cartTotalSpan.textContent = `$${total.toFixed(2)}`;
      localStorage.setItem('cart', JSON.stringify(cart));

      // Remove Item Event Listeners
      document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', () => {
              const index = parseInt(button.dataset.index);
              cart.splice(index, 1);
              updateCartDisplay();
          });
      });

      // Update Stock Display
      document.querySelectorAll('.product .stock span').forEach(span => {
          const stock = parseInt(span.textContent);
          const product = span.closest('.product');
          product.classList.toggle('low', stock <= 5);
      });
  }

  // Clear Cart
  clearCartBtn.addEventListener('click', () => {
      cart = [];
      updateCartDisplay();
  });

  // Checkout and Payment Options
  checkoutBtn.addEventListener('click', () => {
      document.querySelector('.payment-options').style.display = 'block';
  });

  stripePayBtn.addEventListener('click', () => {
      console.log('Stripe payment initiated with cart:', cart);
      alert(`Stripe Checkout coming soon! Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`);
  });

  xrplPayBtn.addEventListener('click', () => {
      console.log('XRPL payment initiated - implement XRPL logic here');
      alert('XRPL payment not yet implemented!');
  });

  // Initialize Cart
  updateCartDisplay();
});