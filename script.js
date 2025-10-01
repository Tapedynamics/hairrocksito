// ===== MOBILE OPTIMIZATIONS =====
// Prevent scroll when mobile menu is open
const body = document.body;

// ===== NAVIGATION MENU =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        body.style.overflow = 'hidden'; // Prevent background scroll
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        body.style.overflow = ''; // Restore scroll
    });
}

// Hide menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        body.style.overflow = ''; // Restore scroll
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('show-menu') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        navMenu.classList.remove('show-menu');
        body.style.overflow = '';
    }
});

// ===== SCROLL HEADER =====
function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader);

// ===== ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', scrollActive);

// ===== SCROLL REVEAL ANIMATION =====
function reveal() {
    const reveals = document.querySelectorAll('.service__card, .gallery__item, .info__card');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Call reveal on load
reveal();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;

        // Create WhatsApp message
        const whatsappMessage = `¡Hola! Me gustaría reservar una cita en Hair Rock.

*Nombre:* ${name}
*Email:* ${email}
*Teléfono:* ${phone}
*Servicio:* ${service}
*Mensaje:* ${message}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // WhatsApp number (mobile)
        const whatsappNumber = '34623460413';

        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        // Show success message
        showNotification('¡Mensaje enviado! Te redirigimos a WhatsApp.', 'success');

        // Reset form
        contactForm.reset();
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Add notification animations
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

    .notification__content {
        display: flex;
        align-items: center;
        gap: 15px;
        font-weight: 600;
    }

    .notification__content i {
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery__item');
let currentImageIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(item.querySelector('img').src);
    });
});

function openLightbox(imageSrc) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__content">
            <span class="lightbox__close">&times;</span>
            <img src="${imageSrc}" alt="Gallery image">
            <button class="lightbox__prev"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox__next"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;

    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close lightbox
    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');

    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyboard);
        }, 300);
    }
}

function navigateLightbox(direction) {
    const totalImages = galleryItems.length;

    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
    } else {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    }

    const newImageSrc = galleryItems[currentImageIndex].querySelector('img').src;
    const lightboxImg = document.querySelector('.lightbox img');

    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = newImageSrc;
        lightboxImg.style.opacity = '1';
    }, 200);
}

function handleKeyboard(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'ArrowRight') navigateLightbox('next');
}

// Add lightbox styles
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .lightbox__content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox__content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 10px;
        transition: opacity 0.3s ease;
    }

    .lightbox__close {
        position: absolute;
        top: -50px;
        right: 0;
        font-size: 3rem;
        color: white;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .lightbox__close:hover {
        transform: rotate(90deg);
    }

    .lightbox__prev,
    .lightbox__next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        padding: 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .lightbox__prev:hover,
    .lightbox__next:hover {
        background: rgba(231, 76, 60, 0.8);
    }

    .lightbox__prev {
        left: 20px;
    }

    .lightbox__next {
        right: 20px;
    }

    @media (max-width: 768px) {
        .lightbox__prev,
        .lightbox__next {
            padding: 10px 15px;
            font-size: 1.5rem;
        }

        .lightbox__close {
            font-size: 2rem;
            top: -40px;
        }
    }
`;
document.head.appendChild(lightboxStyle);

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading images slightly before they enter viewport
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== MOBILE TOUCH OPTIMIZATIONS =====
// Faster click response on mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

// Prevent pull-to-refresh on hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Smooth scroll behavior for iOS Safari
document.documentElement.style.scrollBehavior = 'smooth';

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce scroll events
let scrollTimeout;
function debounceScroll(func, wait = 10) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(scrollTimeout);
            func(...args);
        };
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedReveal = debounceScroll(reveal, 10);
const debouncedScrollActive = debounceScroll(scrollActive, 10);

window.removeEventListener('scroll', reveal);
window.removeEventListener('scroll', scrollActive);
window.addEventListener('scroll', debouncedReveal, { passive: true });
window.addEventListener('scroll', debouncedScrollActive, { passive: true });

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
});

console.log('🎸 Hair Rock Peluquería - Website Loaded Successfully!');
