/* Lumina Creative - Interaction Logic */

async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('components/navbar.html');
        const html = await response.text();
        placeholder.innerHTML = html;

        // Set active link based on current page
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Initialize scroll listener for the newly loaded navbar
        const navbar = document.querySelector('.navbar');
        
        // Initial check for pages like About/Contact that should be 'scrolled' by default if they have a header
        if (currentPage !== 'index.html') {
            navbar.classList.add('scrolled');
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (currentPage === 'index.html') {
                navbar.classList.remove('scrolled');
            }
        });

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    
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

    // Form Submission for Contact & Newsletter
    // Note: This needs to wait for navbar/footer if they contain forms
    // But footer is static for now. In a real scenario, we'd use a more robust event delegation.
    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (form.classList.contains('needs-validation')) {
            const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Prevent page reload for demo
                newsletterModal.show();
                form.reset();
                form.classList.remove('was-validated');
            }
            form.classList.add('was-validated');
        }
    }, false);
});
