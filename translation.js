// Translation system for Greek/English switching
(function() {
    'use strict';

    const STORAGE_KEY = 'alios_language';
    const DEFAULT_LANG = 'el';
    
    let currentLang = DEFAULT_LANG;

    // Initialize translation system
    function initTranslation() {
        // Load saved language preference, default to Greek
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && (savedLang === 'el' || savedLang === 'en')) {
            currentLang = savedLang;
        } else {
            // Default to Greek if no preference is saved
            currentLang = DEFAULT_LANG;
        }

        // Apply translations
        applyTranslations(currentLang);
        
        // Update HTML lang attribute
        document.documentElement.lang = currentLang;
        
        // Update language switcher button
        updateLanguageSwitcher();
    }

    // Apply translations to all elements with data-translate attribute
    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.error('Translation language not found:', lang);
            return;
        }

        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            
            if (translation !== null && translation !== undefined) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.type === 'submit' || element.type === 'button') {
                        element.value = translation;
                    } else if (element.hasAttribute('data-translate-placeholder')) {
                        const placeholderKey = element.getAttribute('data-translate-placeholder');
                        const placeholderTranslation = getTranslation(placeholderKey, lang);
                        if (placeholderTranslation) {
                            element.placeholder = placeholderTranslation;
                        }
                    }
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Handle title and meta description
        const titleKey = document.querySelector('title')?.getAttribute('data-translate');
        if (titleKey) {
            const titleTranslation = getTranslation(titleKey, lang);
            if (titleTranslation) {
                document.title = titleTranslation;
            }
        }

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const descKey = metaDesc.getAttribute('data-translate');
            if (descKey) {
                const descTranslation = getTranslation(descKey, lang);
                if (descTranslation) {
                    metaDesc.content = descTranslation;
                }
            }
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    // Get translation by key path (e.g., 'home.title' or 'nav.home')
    function getTranslation(key, lang) {
        if (!translations[lang]) return null;
        
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    // Switch language
    function switchLanguage(lang) {
        if (lang !== 'el' && lang !== 'en') {
            console.error('Invalid language:', lang);
            return;
        }

        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations(lang);
        updateLanguageSwitcher();
    }

    // Update language switcher button text
    function updateLanguageSwitcher() {
        const switcher = document.getElementById('languageSwitcher');
        if (switcher) {
            const nextLang = currentLang === 'el' ? 'en' : 'el';
            switcher.textContent = nextLang.toUpperCase();
            switcher.setAttribute('aria-label', `Switch to ${nextLang === 'el' ? 'Greek' : 'English'}`);
            switcher.setAttribute('title', `Switch to ${nextLang === 'el' ? 'Greek' : 'English'}`);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslation);
    } else {
        initTranslation();
    }

    // Expose switchLanguage function globally
    window.switchLanguage = function(lang) {
        switchLanguage(lang);
    };

    // Handle language switcher button clicks
    document.addEventListener('click', function(e) {
        if (e.target.id === 'languageSwitcher' || e.target.closest('#languageSwitcher')) {
            const nextLang = currentLang === 'el' ? 'en' : 'el';
            switchLanguage(nextLang);
        }
    });
})();

