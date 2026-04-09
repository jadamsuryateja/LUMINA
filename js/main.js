/* Lumina Creative - Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Enable reveal animations
    document.body.classList.add('js-enabled');
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
    const forms = document.querySelectorAll('.needs-validation');
    const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal'));

    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
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
        }, false);
    });
});
