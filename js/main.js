import emailjs from '@emailjs/browser';

/* Lumina Creative - Interaction Logic */

async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('/components/navbar.html');
        const html = await response.text();
        placeholder.innerHTML = html;

        // Set active link based on current page
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });

        // Initialize scroll listener for the newly loaded navbar
        const navbar = document.querySelector('.navbar');
        
        // Universal Transparency Logic: Transparent at top, solid on scroll
        // This applies to ALL pages now that we have headers/banners everywhere
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

async function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('/components/footer.html');
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Initialize EmailJS from Environment Variables (Vite)
const initEmailJS = () => {
    if (typeof emailjs !== 'undefined') {
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (publicKey && publicKey !== "YOUR_PUBLIC_KEY") {
            emailjs.init({
                publicKey: publicKey,
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
    initEmailJS();
    
    // Enable reveal animations
    document.body.classList.add('js-enabled');

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Integrated Form Submission (EmailJS + Modal)
    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (form.classList.contains('needs-validation')) {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                const sendButton = form.querySelector('[type="submit"]');
                const originalText = sendButton.innerText;
                
                // Show loading state
                sendButton.innerText = "TRANSMITTING...";
                sendButton.disabled = true;

                // Handle both Contact Form and Newsletter (if IDs match)
                if (form.id === 'contact-form') {
                    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

                    emailjs.sendForm(serviceId, templateId, form)
                        .then(() => {
                            const successModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
                            successModal.show();
                            form.reset();
                            form.classList.remove('was-validated');
                        }, (error) => {
                            alert("TRANSMISSION FAILED: " + JSON.stringify(error));
                        })
                        .finally(() => {
                            sendButton.innerText = originalText;
                            sendButton.disabled = false;
                        });
                } else {
                    // Simpler logic for newsletter or general forms
                    setTimeout(() => {
                        const successModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
                        successModal.show();
                        form.reset();
                        form.classList.remove('was-validated');
                        sendButton.innerText = originalText;
                        sendButton.disabled = false;
                    }, 1000);
                }
            }
        }
    }, false);
});
