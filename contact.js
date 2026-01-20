// Pre-fill form based on URL parameters
const urlParams = new URLSearchParams(window.location.search);
const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
const interestParam = urlParams.get('interest') || hashParams.get('interest');

if (interestParam) {
    const interestSelect = document.getElementById('interest');
    if (interestSelect) {
        if (interestParam === 'join') {
            interestSelect.value = 'join';
        } else if (interestParam === 'collaborate') {
            interestSelect.value = 'collaborate';
        }
        // Scroll to form
        setTimeout(() => {
            const formElement = document.querySelector('.contact-form') || document.getElementById('contact');
            if (formElement) {
                const headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
                const targetPosition = formElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Αποστολή...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        
        try {
            const formData = new FormData(contactForm);
            
            // Set _replyto to user's email for Formspree (so replies go to the user)
            const userEmail = formData.get('email');
            if (userEmail) {
                formData.set('_replyto', userEmail);
            }
            
            // Use Formspree or similar service
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formMessage.textContent = 'Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.';
                formMessage.className = 'form-message success';
                // Reset form but preserve the interest field if it was pre-filled
                const interestValue = document.getElementById('interest').value;
                contactForm.reset();
                if (interestValue && interestParam) {
                    document.getElementById('interest').value = interestValue;
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            formMessage.textContent = 'Υπήρξε ένα σφάλμα κατά την αποστολή. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας απευθείας στο email.';
            formMessage.className = 'form-message error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

