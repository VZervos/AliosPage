// Social Media Posts Integration
// This file handles fetching and displaying Facebook/Instagram posts

// ============================================
// CONFIGURATION - Update these values
// ============================================

const SOCIAL_CONFIG = {
    // Facebook Configuration
    facebook: {
        enabled: false, // Set to true to enable Facebook posts
        pageId: 'corfuallios', // Your Facebook page ID or username
        accessToken: '', // Your Facebook Page Access Token (NEVER expose in production!)
        apiVersion: 'v18.0',
        postLimit: 5
    },
    
    // Instagram Configuration
    instagram: {
        enabled: false, // Set to true to enable Instagram posts
        accessToken: '', // Your Instagram Access Token (NEVER expose in production!)
        userId: '', // Your Instagram User ID
        postLimit: 5
    },
    
    // Fallback: Use Facebook Page Plugin instead
    usePagePlugin: true // Set to true to use Facebook Page Plugin embed (no API needed)
};

// ============================================
// FACEBOOK GRAPH API
// ============================================

async function fetchFacebookPosts() {
    if (!SOCIAL_CONFIG.facebook.enabled || !SOCIAL_CONFIG.facebook.accessToken) {
        console.warn('Facebook posts disabled or missing access token');
        return [];
    }
    
    try {
        const url = `https://graph.facebook.com/${SOCIAL_CONFIG.facebook.apiVersion}/${SOCIAL_CONFIG.facebook.pageId}/posts?` +
            `access_token=${SOCIAL_CONFIG.facebook.accessToken}` +
            `&fields=message,created_time,full_picture,permalink_url,story` +
            `&limit=${SOCIAL_CONFIG.facebook.postLimit}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Facebook API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Facebook posts:', error);
        return [];
    }
}

// ============================================
// INSTAGRAM BASIC DISPLAY API
// ============================================

async function fetchInstagramPosts() {
    if (!SOCIAL_CONFIG.instagram.enabled || !SOCIAL_CONFIG.instagram.accessToken) {
        console.warn('Instagram posts disabled or missing access token');
        return [];
    }
    
    try {
        // First, get user's media
        const mediaUrl = `https://graph.instagram.com/me/media?` +
            `fields=id,caption,media_type,media_url,permalink,timestamp` +
            `&access_token=${SOCIAL_CONFIG.instagram.accessToken}` +
            `&limit=${SOCIAL_CONFIG.instagram.postLimit}`;
        
        const response = await fetch(mediaUrl);
        
        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        return [];
    }
}

// ============================================
// DISPLAY POSTS IN CAROUSEL
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Τώρα';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} λεπτά πριν`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ώρες πριν`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ημέρες πριν`;
    
    return date.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function createFacebookPostElement(post) {
    const postItem = document.createElement('div');
    postItem.className = 'social-post-item';
    
    const message = post.message || post.story || 'Δημοσίευση από Facebook';
    const image = post.full_picture ? `<img src="${post.full_picture}" alt="Facebook post" style="width: 100%; border-radius: 8px; margin-bottom: 12px;">` : '';
    
    postItem.innerHTML = `
        <div class="social-post-content">
            <div class="social-post-header">
                <div class="social-post-avatar">
                    <img src="https://www.alios-corfu.com/wp-content/uploads/2020/09/cropped-ALIOS-LOGO-150x150.jpg" alt="Ο Άλιος">
                </div>
                <div class="social-post-info">
                    <h4>Ο Άλιος</h4>
                    <span class="social-post-date">${formatDate(post.created_time)}</span>
                </div>
            </div>
            ${image}
            <div class="social-post-text">
                <p>${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>
            <div class="social-post-actions">
                <a href="${post.permalink_url}" target="_blank" class="social-link-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Δείτε στο Facebook
                </a>
            </div>
        </div>
    `;
    
    return postItem;
}

function createInstagramPostElement(post) {
    const postItem = document.createElement('div');
    postItem.className = 'social-post-item';
    
    const caption = post.caption ? post.caption.substring(0, 200) : 'Δημοσίευση από Instagram';
    const image = post.media_url ? `<img src="${post.media_url}" alt="Instagram post" style="width: 100%; border-radius: 8px; margin-bottom: 12px;">` : '';
    
    postItem.innerHTML = `
        <div class="social-post-content">
            <div class="social-post-header">
                <div class="social-post-avatar">
                    <img src="https://www.alios-corfu.com/wp-content/uploads/2020/09/cropped-ALIOS-LOGO-150x150.jpg" alt="Ο Άλιος">
                </div>
                <div class="social-post-info">
                    <h4>Ο Άλιος</h4>
                    <span class="social-post-date">${formatDate(post.timestamp)}</span>
                </div>
            </div>
            ${image}
            <div class="social-post-text">
                <p>${caption}${post.caption && post.caption.length > 200 ? '...' : ''}</p>
            </div>
            <div class="social-post-actions">
                <a href="${post.permalink}" target="_blank" class="social-link-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Δείτε στο Instagram
                </a>
            </div>
        </div>
    `;
    
    return postItem;
}

// ============================================
// INITIALIZE SOCIAL MEDIA POSTS
// ============================================

async function loadSocialMediaPosts() {
    const container = document.querySelector('.social-posts-container');
    if (!container) return;
    
    // Clear placeholder
    container.innerHTML = '';
    
    const posts = [];
    
    // Fetch Facebook posts
    if (SOCIAL_CONFIG.facebook.enabled) {
        const fbPosts = await fetchFacebookPosts();
        fbPosts.forEach(post => {
            posts.push(createFacebookPostElement(post));
        });
    }
    
    // Fetch Instagram posts
    if (SOCIAL_CONFIG.instagram.enabled) {
        const igPosts = await fetchInstagramPosts();
        igPosts.forEach(post => {
            posts.push(createInstagramPostElement(post));
        });
    }
    
    // Add posts to container
    if (posts.length > 0) {
        posts.forEach(post => container.appendChild(post));
        
        // Reinitialize carousel
        if (typeof updateSocialCarousel === 'function') {
            updateSocialCarousel();
        }
    } else {
        // Show fallback message
        container.innerHTML = `
            <div class="social-post-item">
                <div class="social-post-content">
                    <div class="social-post-text">
                        <p>Ακολουθήστε μας στα social media για να δείτε τις τελευταίες μας δραστηριότητες!</p>
                    </div>
                    <div class="social-post-actions">
                        <a href="https://www.facebook.com/corfuallios" target="_blank" class="social-link-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// ============================================
// FACEBOOK PAGE PLUGIN (Alternative - No API needed)
// ============================================

function loadFacebookPagePlugin() {
    const container = document.querySelector('.social-posts-container');
    if (!container) return;
    
    // Load Facebook SDK if not already loaded
    if (!window.FB) {
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/el_GR/sdk.js#xfbml=1&version=v18.0';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
        
        script.onload = () => {
            window.FB.init({
                xfbml: true,
                version: 'v18.0'
            });
        };
    }
    
    // Replace container with Facebook Page Plugin
    container.innerHTML = `
        <div class="fb-page" 
             data-href="https://www.facebook.com/corfuallios" 
             data-tabs="timeline" 
             data-width="500" 
             data-height="600" 
             data-small-header="true" 
             data-adapt-container-width="true" 
             data-hide-cover="false" 
             data-show-facepile="true">
            <blockquote cite="https://www.facebook.com/corfuallios" class="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/corfuallios">Ο Άλιος</a>
            </blockquote>
        </div>
    `;
    
    // Parse the plugin
    if (window.FB) {
        window.FB.XFBML.parse(container);
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (SOCIAL_CONFIG.usePagePlugin) {
        // Use Facebook Page Plugin (easiest, no API needed)
        loadFacebookPagePlugin();
    } else {
        // Use API to fetch posts
        loadSocialMediaPosts();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchFacebookPosts,
        fetchInstagramPosts,
        loadSocialMediaPosts,
        loadFacebookPagePlugin
    };
}

