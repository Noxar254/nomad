// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Registration Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('registrationModal');
    const modalTitle = document.getElementById('modalTourTitle');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const registerButtons = document.querySelectorAll('.btn-register');
    const registrationForm = document.getElementById('registrationForm');

    // Open modal when register button is clicked
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tourName = this.getAttribute('data-tour');
            const tourPrice = this.getAttribute('data-price');
            
            modalTitle.textContent = `Register for ${tourName}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when Cancel button is clicked
    cancelBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        registrationForm.reset(); // Reset form fields
    }

    // Handle form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the tour name from modal title
        const tourName = modalTitle.textContent.replace('Register for ', '');
        
        // Get form data
        const formData = new FormData(this);
        const registrationData = {
            timestamp: new Date().toLocaleString(),
            tourName: tourName,
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            emergencyContact: formData.get('emergencyContact'),
            emergencyPhone: formData.get('emergencyPhone'),
            participants: formData.get('participants'),
            dietary: formData.get('dietary') || 'None',
            specialRequests: formData.get('specialRequests') || 'None',
            terms: formData.get('terms') ? 'Yes' : 'No',
            newsletter: formData.get('newsletter') ? 'Yes' : 'No'
        };

        // Basic validation
        if (!registrationData.fullName || !registrationData.email || !registrationData.phone || 
            !registrationData.emergencyContact || !registrationData.emergencyPhone || !registrationData.terms === 'No') {
            alert('Please fill in all required fields and accept the terms and conditions.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registrationData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Send data to Google Spreadsheet
        sendToGoogleSheets(registrationData, submitBtn, originalText);
    });

    // Function to send data to Google Sheets
    function sendToGoogleSheets(data, submitBtn, originalText) {
        // Replace this URL with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzBFDPBrhkg1lmTlFaAwK1uoTMi9A28dRKDvt4-AuJkCZR0We7gs4ulQYbwR75MmKbiw/exec';
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Success notification
            alert(`Thank you, ${data.fullName}! Your registration for ${data.tourName} has been submitted successfully. We will contact you shortly at ${data.email} to confirm your booking and provide payment details.`);
            
            closeModal();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error submitting your registration. Please try again or contact us directly.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
