// Header Scroll Effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Image Carousel
let carouselInitialized = false;
let carouselAutoplayInterval = null;

function initCarousel() {
    // Prevent multiple initializations
    if (carouselInitialized) return;
    
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselPagination = document.getElementById('carouselPagination');

    if (!carouselTrack || !carouselPrev || !carouselNext) return;

    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    carouselInitialized = true;
    let currentSlide = 0;
    let isTransitioning = false;

    // Clear any existing interval
    if (carouselAutoplayInterval) {
        clearInterval(carouselAutoplayInterval);
        carouselAutoplayInterval = null;
    }

    // Create pagination dots
    if (carouselPagination) {
        carouselPagination.innerHTML = ''; // Clear existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            carouselPagination.appendChild(dot);
        });
    }

    const updateCarousel = () => {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update pagination dots
        if (carouselPagination) {
            const dots = carouselPagination.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    };

    const goToSlide = (index) => {
        if (isTransitioning) return; // Prevent rapid clicks
        isTransitioning = true;
        
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        updateCarousel();
        resetAutoplay();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600); // Match CSS transition duration
    };

    const nextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
        resetAutoplay();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
        resetAutoplay();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };

    const startAutoplay = () => {
        // Clear any existing interval first
        if (carouselAutoplayInterval) {
            clearInterval(carouselAutoplayInterval);
        }
        carouselAutoplayInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    };

    const stopAutoplay = () => {
        if (carouselAutoplayInterval) {
            clearInterval(carouselAutoplayInterval);
            carouselAutoplayInterval = null;
        }
    };

    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    // Remove any existing event listeners by cloning and replacing
    const newNext = carouselNext.cloneNode(true);
    carouselNext.parentNode.replaceChild(newNext, carouselNext);
    newNext.addEventListener('click', nextSlide);

    const newPrev = carouselPrev.cloneNode(true);
    carouselPrev.parentNode.replaceChild(newPrev, carouselPrev);
    newPrev.addEventListener('click', prevSlide);

    // Pause autoplay on hover
    const carousel = document.getElementById('imageCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation with debouncing
    let lastKeyPress = 0;
    document.addEventListener('keydown', (e) => {
        const now = Date.now();
        if (now - lastKeyPress < 300) return; // Debounce
        lastKeyPress = now;
        
        if (carousel && (carousel.contains(document.activeElement) || document.activeElement === document.body)) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let lastSwipe = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastSwipe < 300) return; // Debounce swipes
            lastSwipe = now;
            
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // Initial update
    updateCarousel();
    
    // Start autoplay after a short delay
    setTimeout(() => {
        startAutoplay();
    }, 1000);
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.includes('#')) {
            const hashPart = href.split('#')[1];
            const hashId = hashPart ? hashPart.split('?')[0] : null;
            
            if (hashId) {
                const target = document.getElementById(hashId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL with hash and query params
                    if (href.includes('?')) {
                        setTimeout(() => {
                            window.location.hash = hashPart;
                        }, 500);
                    } else {
                        setTimeout(() => {
                            window.location.hash = hashId;
                        }, 500);
                    }
                }
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.about-card, .content-block, .gallery-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}
