// Shopping Cart
let cart = [];

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${productName} ditambahkan ke keranjang!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

function updateQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
    }
    displayCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">Keranjang Anda kosong</div>';
        document.getElementById('subtotal').textContent = 'Rp 0';
        document.getElementById('total').textContent = 'Rp 20.000';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Hapus</button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    
    const shipping = 20000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('total').textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function openCart() {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + 20000;
    
    let message = 'Halo, saya ingin memesan:\n\n';
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    message += `\nSubtotal: Rp ${subtotal.toLocaleString('id-ID')}\nOngkir: Rp 20.000\nTotal: Rp ${total.toLocaleString('id-ID')}`;
    
    const whatsappNumber = '6281234567890';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Product Filter
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'scale(1)';
            }, 10);
        } else {
            product.style.display = 'none';
        }
    });
}

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Cart button
document.querySelector('.cart-btn').addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

// Close modal when clicked outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Smooth scroll
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ behavior: 'smooth' });
}

// Contact Form
function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const message = form.querySelector('textarea').value;
    
    const whatsappNumber = '6281234567890';
    const fullMessage = `Nama: ${name}\nEmail: ${email}\nTelepon: ${phone}\n\nPesan:\n${message}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    form.reset();
    showNotification('Pesan Anda telah dikirim ke WhatsApp!');
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .product-card {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.3s, transform 0.3s;
    }
`;
document.head.appendChild(style);

// Initialize
updateCartCount();