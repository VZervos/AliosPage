// Gallery Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const photoItems = document.querySelectorAll('.photo-item, .video-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        photoItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Video Play Button Click
const videoItems = document.querySelectorAll('.video-item');
videoItems.forEach(item => {
    item.addEventListener('click', () => {
        const videoThumbnail = item.querySelector('.video-thumbnail');
        const video = item.querySelector('video');
        
        if (video && videoThumbnail) {
            // Hide thumbnail and play button
            videoThumbnail.style.display = 'none';
            // Show and play video
            video.style.display = 'block';
            video.controls = true;
            video.play().catch(err => {
                console.error('Error playing video:', err);
            });
        }
    });
});

// Lightbox for images (simple implementation)
function initLightbox() {
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        // Add click handler to the entire photo-item
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on overlay (though it's hidden)
            if (e.target.closest('.photo-overlay')) return;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = '';
            };
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            
            // Close on Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    });
}

// Initialize lightbox when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}



