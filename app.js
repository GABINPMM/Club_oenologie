/**
 * CLUB OENOLOGIE D'ANGERS - Client-side script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-item');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open'); // Prevent body scroll if needed
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // ==========================================================================
    // STICKY HEADER & SCROLLSHRINK
    // ==========================================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on load

    // ==========================================================================
    // SCROLLSPY (Active section highlighting)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const scrollspy = () => {
        let currentSectionId = 'accueil';
        const scrollPosition = window.scrollY + 150; // offset for nav height and margin

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollspy);
    scrollspy(); // Initialize on load

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        animatedElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    // ==========================================================================
    // CONTACT FORM INTERACTIVITY
    // ==========================================================================
    const contactForm = document.getElementById('wineContactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const comments = document.getElementById('contactComments').value.trim();

            if (!name || !email || !subject || !comments) {
                showFormStatus('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Simple email validation pattern
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFormStatus('Veuillez saisir une adresse email valide.', 'error');
                return;
            }

            // Simulate sending message
            const btnSubmit = document.getElementById('btnSubmit');
            const originalBtnText = btnSubmit.textContent;
            btnSubmit.textContent = 'Envoi en cours...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                showFormStatus(`Merci ${name} ! Votre message concernant "${subject}" a bien été envoyé. Nous vous répondrons très rapidement sur votre adresse ${email}.`, 'success');
                contactForm.reset();
                btnSubmit.textContent = originalBtnText;
                btnSubmit.disabled = false;
            }, 1200);
        });

        // Hide form status when resetting
        contactForm.addEventListener('reset', () => {
            formStatus.style.display = 'none';
            formStatus.className = 'form-status-message';
            formStatus.textContent = '';
        });
    }

    const showFormStatus = (message, type) => {
        formStatus.textContent = message;
        formStatus.className = `form-status-message ${type}`;
        formStatus.style.display = 'block';
        
        // Scroll to status message on mobile so user sees it
        if (window.innerWidth < 768) {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
});
