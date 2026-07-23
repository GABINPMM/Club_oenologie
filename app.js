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
    let observer = null;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target); // Animates only once
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
    // CHARGEMENT DYNAMIQUE DES ACTUALITÃ‰S
    // ==========================================================================
    const actualitesGrid = document.querySelector('.actualites-grid');
    if (actualitesGrid) {
        fetch('actualites.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement de actualites.html');
                }
                return response.text();
            })
            .then(htmlText => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // Charger le bloc "EN BREF" dynamiquement
                const enBrefSource = doc.getElementById('en-bref-source');
                const enBrefTarget = document.getElementById('en-bref-text-container');
                if (enBrefSource && enBrefTarget) {
                    enBrefTarget.innerHTML = enBrefSource.innerHTML;
                }

                const actuElements = doc.querySelectorAll('.actualite');

                // Vider le conteneur statique
                actualitesGrid.innerHTML = '';

                let loadedCount = 0;
                actuElements.forEach(el => {
                    if (loadedCount >= 8) return;

                    const titre = el.querySelector('.titre')?.innerHTML.trim() || '';
                    // Si rien n'est Ã©crit dans le titre, on ne l'affiche pas
                    if (!titre) return;

                    const decor = el.querySelector('.decor')?.textContent.trim() || 'wine';
                    const badge = el.querySelector('.badge')?.innerHTML.trim() || '';
                    const texte = el.querySelector('.texte')?.innerHTML.trim() || '';
                    const infoMiseEnValeur = el.querySelector('.info-mise-en-valeur')?.innerHTML.trim() || '';
                    const lienUrl = el.querySelector('.lien-url')?.textContent.trim() || '';
                    const lienTexte = el.querySelector('.lien-texte')?.innerHTML.trim() || '';

                    // CrÃ©ation de l'Ã©lÃ©ment de carte
                    const card = document.createElement('div');
                    card.className = 'actu-card animate-on-scroll';

                    // Choix de la couleur pastel du bandeau-titre selon le dÃ©cor
                    let titreBandClass = 'actu-titre-band-wine';
                    if (decor === 'apogee') {
                        titreBandClass = 'actu-titre-band-apogee';
                    } else if (decor === 'chateau') {
                        titreBandClass = 'actu-titre-band-chateau';
                    } else if (decor === 'epire') {
                        titreBandClass = 'actu-titre-band-epire';
                    }

                    // Le titre est affichÃ© dans un rectangle colorÃ© pastel (sans libellÃ© dÃ©coratif ni badge sÃ©parÃ©)
                    let cardHtml = `
                        <div class="actu-card-titre-band ${titreBandClass}">${titre}</div>
                        <div class="actu-card-content">
                    `;

                    if (texte) {
                        cardHtml += `    <p class="actu-card-text">${texte}</p>`;
                    }

                    if (infoMiseEnValeur) {
                        cardHtml += `    <div class="actu-highlight-info">${infoMiseEnValeur}</div>`;
                    }

                    if (lienUrl && lienTexte) {
                        cardHtml += `
                            <div class="actu-card-footer">
                                <a href="${lienUrl}" class="btn-text-link" target="_blank" rel="noopener">
                                    <span>${lienTexte}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                            </div>
                        `;
                    }

                    cardHtml += `</div>`;
                    card.innerHTML = cardHtml;

                    actualitesGrid.appendChild(card);

                    // Observation de la nouvelle carte pour l'animation
                    if (observer) {
                        observer.observe(card);
                    } else {
                        card.classList.add('revealed');
                    }

                    loadedCount++;
                });
            })
            .catch(err => {
                console.error('Erreur lors du chargement des actualitÃ©s:', err);
                actualitesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Erreur lors du chargement des actualitÃ©s.</p>';
            });
    }

    // ==========================================================================
    // CHARGEMENT DYNAMIQUE DES FORMATIONS (tableau NOS FORMATIONS)
    // ==========================================================================
    const formationsTableauContainer = document.getElementById('formations-tableau-container');
    const formationsPdfContainer    = document.getElementById('formations-pdf-container');

    if (formationsTableauContainer) {
        fetch('formations.html')
            .then(response => {
                if (!response.ok) throw new Error('Erreur lors du chargement de formations.html');
                return response.text();
            })
            .then(htmlText => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                const tableauSource = doc.getElementById('formations-tableau-source');
                if (tableauSource && formationsTableauContainer) {
                    const modules = tableauSource.querySelectorAll('.module');

                    let tableHtml = `<table class="modules-table">
                        <thead><tr>
                            <th>Module</th>
                            <th>Dates &amp; Horaires</th>
                            <th>Contenu</th>
                            <th>Tarif</th>
                        </tr></thead>
                        <tbody>`;

                    modules.forEach(m => {
                        const nom     = m.querySelector('.nom')?.innerHTML.trim()     || '';
                        const dates   = m.querySelector('.dates')?.innerHTML.trim()   || '';
                        const contenu = m.querySelector('.contenu')?.innerHTML.trim() || '';
                        const detail  = m.querySelector('.detail')?.innerHTML.trim()  || '';
                        const tarif   = m.querySelector('.tarif')?.innerHTML.trim()   || '';

                        if (!nom) return;

                        tableHtml += `<tr>
                            <td class="module-name-cell">${nom}</td>
                            <td class="module-date-cell">${dates}</td>
                            <td>
                                <div class="cell-content">
                                    <p>${contenu}</p>
                                    ${detail ? `<p class="highlight-text">${detail}</p>` : ''}
                                </div>
                            </td>
                            <td class="module-price-cell"><span class="price-badge">${tarif}</span></td>
                        </tr>`;
                    });

                    tableHtml += `</tbody></table>`;
                    formationsTableauContainer.innerHTML = tableHtml;

                    // Bouton PDF
                    if (formationsPdfContainer) {
                        const pdfLien  = tableauSource.querySelector('.pdf-lien')?.textContent.trim()  || '';
                        const pdfTexte = tableauSource.querySelector('.pdf-texte')?.textContent.trim() || '';
                        if (pdfLien && pdfTexte) {
                            formationsPdfContainer.innerHTML = `<a href="${pdfLien}" class="btn btn-primary" download>${pdfTexte}</a>`;
                        }
                    }
                }
            })
            .catch(err => {
                console.error('Erreur lors du chargement des formations:', err);
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

            // Build form data
            const formData = new FormData(contactForm);

            const btnSubmit = document.getElementById('btnSubmit');
            const originalBtnText = btnSubmit.textContent;
            btnSubmit.textContent = 'Envoi en cours...';
            btnSubmit.disabled = true;

            // Envoi des donnÃ©es vers le script PHP
            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur rÃ©seau lors de la communication avec le serveur.');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showFormStatus(`Merci ${name} ! Votre message a bien Ã©tÃ© envoyÃ©. Nous vous rÃ©pondrons rapidement.`, 'success');
                    contactForm.reset();
                } else {
                    showFormStatus(data.message || 'Une erreur est survenue.', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                showFormStatus('Une erreur technique est survenue lors de l\'envoi. Veuillez utiliser directement notre e-mail oenocapucins@gmail.com.', 'error');
            })
            .finally(() => {
                btnSubmit.textContent = originalBtnText;
                btnSubmit.disabled = false;
            });
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

    // ==========================================================================
    // CONFIRMATION DE L'Ã‚GE (18 ANS)
    // ==========================================================================
    const ageModal = document.getElementById('age-verification-modal');
    const ageVerifyYes = document.getElementById('age-verify-yes');
    const ageVerifyNo = document.getElementById('age-verify-no');

    if (ageModal) {
        // VÃ©rifier si le choix a dÃ©jÃ  Ã©tÃ© enregistrÃ© dans localStorage
        const isVerified = localStorage.getItem('age-verified') === 'true';

        if (isVerified) {
            ageModal.classList.add('hidden');
        } else {
            document.body.classList.add('modal-open');
        }

        if (ageVerifyYes) {
            ageVerifyYes.addEventListener('click', () => {
                localStorage.setItem('age-verified', 'true');
                ageModal.classList.add('hidden');
                document.body.classList.remove('modal-open');
            });
        }

        if (ageVerifyNo) {
            ageVerifyNo.addEventListener('click', () => {
                // Rediriger vers Google si l'utilisateur est mineur
                window.location.href = 'https://www.google.fr';
            });
        }
    }
});
