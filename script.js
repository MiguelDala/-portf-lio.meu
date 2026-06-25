// Splash Screen / Tela Inicial
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const enterButton = document.getElementById('enter-portfolio');

// Verificar se já entrou no portfólio antes
const hasEntered = sessionStorage.getItem('portfolioEntered');

if (hasEntered && splashScreen && mainContent) {
    // Se já entrou, esconder splash screen imediatamente
    splashScreen.classList.add('hidden');
    splashScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';
    mainContent.style.pointerEvents = 'auto';
    mainContent.style.position = 'relative';
    mainContent.style.height = 'auto';
} else if (mainContent) {
    // Se não entrou, mostrar splash screen e esconder conteúdo
    mainContent.classList.add('hidden');
}

// Função para mostrar o conteúdo principal (global para onclick)
window.showMainContent = function showMainContent() {
    if (splashScreen) {
        splashScreen.classList.add('hidden');
        splashScreen.style.display = 'none';
        splashScreen.style.visibility = 'hidden';
        splashScreen.style.opacity = '0';
        splashScreen.style.zIndex = '-1';
    }

    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
        mainContent.style.pointerEvents = 'auto';
        mainContent.style.position = 'relative';
        mainContent.style.height = 'auto';
        mainContent.style.zIndex = '1';
        mainContent.style.width = '100%';
    }

    sessionStorage.setItem('portfolioEntered', 'true');
    window.scrollTo(0, 0);

    if (typeof initHeroPhotoCarousel === 'function') {
        initHeroPhotoCarousel(true);
    }

    if (typeof initSchoolMap === 'function') {
        initSchoolMap();
    }
};

// Botão para entrar no portfólio
if (enterButton) {
    enterButton.addEventListener('click', function(e) {
        e.preventDefault();
        showMainContent();
    });
}

// Permitir pular splash screen com tecla ESC ou duplo clique na splash
if (splashScreen) {
    splashScreen.addEventListener('dblclick', showMainContent);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            showMainContent();
        }
    });
}

// Ícones da splash carregam depois do conteúdo principal (não bloqueiam)
function loadDeferredImages(root) {
    (root || document).querySelectorAll('img[data-src]:not([src])').forEach(img => {
        img.src = img.dataset.src;
    });
}

function loadDeferredIframes(root) {
    (root || document).querySelectorAll('iframe[data-src]:not([src])').forEach(frame => {
        frame.src = frame.dataset.src;
    });
}

if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadDeferredImages(document.querySelector('.tech-orbits')), { timeout: 2500 });
} else {
    setTimeout(() => loadDeferredImages(document.querySelector('.tech-orbits')), 1500);
}

// Theme toggle functionality + persistence (via profile image click)
const body = document.body;

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
}

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Back to top button functionality
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animate project cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-mosaic-item, .skill-bar, .featured-project').forEach(card => {
    observer.observe(card);
});

// Lazy-load all images except the profile image e o carrossel do hero (precisam aparecer já)
document.querySelectorAll('img').forEach(img => {
    const isHeroProfile = img.closest('.profile-image');
    const isHeroCarousel = img.closest('.hero-bg-carousel');
    if (!isHeroProfile && !isHeroCarousel) {
        img.setAttribute('loading', 'lazy');
        
        // Add loaded class when image loads
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    }
});

// Header scroll effect - moved to optimized handler below

// Animação fade-in para seções ao rolar a página
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => {
    if (section.id && section.id !== 'home') {
        section.classList.add('visible');
    }
    sectionObserver.observe(section);
});

// Alternar modo dark/light ao clicar na foto de perfil
const profileImg = document.querySelector('.profile-image img');
const splashProfileImg = document.querySelector('.splash-image');
if (profileImg) {
    profileImg.addEventListener('click', () => {
        const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
}

// Alternar modo dark/light ao clicar na foto da splash screen
if (splashProfileImg) {
    splashProfileImg.addEventListener('click', () => {
        const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
}

// Animação para os novos cards da timeline
const animatedCards = document.querySelectorAll('.animated-card');
const animatedCardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

animatedCards.forEach(card => {
    animatedCardObserver.observe(card);
});

// Animate skill bars when they enter the viewport
const skillBars = document.querySelectorAll('.bar-fill');
const originalWidths = new WeakMap();

// Store original width and reset to 0 initially for animation
skillBars.forEach(bar => {
    const computedWidth = getComputedStyle(bar).width;
    originalWidths.set(bar, computedWidth);
    bar.style.width = '0px';
});

const skillsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = originalWidths.get(bar);
            bar.style.width = width;
            obs.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillsObserver.observe(bar));

// Contact form: Web3Forms - envia automaticamente para o Gmail (danilomanuel040@gmail.com)
// Os dados ficam guardados no dashboard Web3Forms durante 30 dias
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('#submitBtn');
        const feedback = document.getElementById('formFeedback');
        
        if (!contactForm.querySelector('input[name="access_key"]')?.value || 
            contactForm.querySelector('input[name="access_key"]').value === 'COLOQUE_SUA_ACCESS_KEY_AQUI') {
            if (feedback) {
                feedback.className = 'form-feedback form-feedback-error';
                feedback.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Configure a Access Key no formulário (web3forms.com)';
                feedback.style.display = 'block';
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';
        }
        if (feedback) feedback.style.display = 'none';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                if (feedback) {
                    feedback.className = 'form-feedback form-feedback-success';
                    feedback.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada! Receberá no Gmail em breve.';
                    feedback.style.display = 'block';
                }
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Erro ao enviar');
            }
        } catch (err) {
            if (feedback) {
                feedback.className = 'form-feedback form-feedback-error';
                feedback.innerHTML = '<i class="fas fa-times-circle"></i> ' + (err.message || 'Erro ao enviar. Tente novamente.');
                feedback.style.display = 'block';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar';
            }
        }
    });
}

// Footer year auto-update (keeps 2024 style but updates year dynamically)
const footerText = document.querySelector('footer p');
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = footerText.innerHTML.replace(/\b20\d{2}\b|\b19\d{2}\b/, String(currentYear));
}

// Add ripple effect to buttons
document.querySelectorAll('.project-button, .contact-form button, .social-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});


// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll handlers
let lastScroll = 0;
const header = document.querySelector('.header');

const optimizedScrollHandler = debounce(() => {
    const currentScroll = window.pageYOffset;

    if (header) {
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            lastScroll = currentScroll;
        } else if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    }

    if (backToTopButton) {
        backToTopButton.style.display = currentScroll > 300 ? 'flex' : 'none';
    }

    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
        if (currentScroll >= section.offsetTop - 80) {
            current = section.id;
        }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, 16);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Iframe do projeto em destaque só carrega quando visível
const lazyIframe = document.querySelector('.project-preview-iframe[data-src]');
if (lazyIframe) {
    const iframeObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadDeferredIframes(entry.target.parentElement);
                obs.disconnect();
            }
        });
    }, { rootMargin: '120px' });
    iframeObserver.observe(lazyIframe);
}

// Enhanced typing effect with multiple texts
const typingElement = document.querySelector('.typing-effect');
if (typingElement) {
    const texts = ['| Programador', '| Desenvolvedor', '| Criador', '| Inovador'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 400);
}

function loadCarouselSlideImage(slide) {
    const img = slide?.querySelector('img');
    if (!img || !img.dataset.src || img.dataset.loaded === '1') return;
    img.src = img.dataset.src;
    img.dataset.loaded = '1';
}

// Carrossel automático de destaques no hero
function initHeroPhotoCarousel(restart) {
    const hero = document.querySelector('.hero.new-hero-layout.has-photo-carousel');
    if (!hero) return;

    const slides = hero.querySelectorAll('.hero-bg-slide');
    const dots = hero.querySelectorAll('.hero-carousel-dot');
    if (!slides.length) return;

    if (hero._carouselTimer) {
        clearInterval(hero._carouselTimer);
        hero._carouselTimer = null;
    }

    let index = Array.from(slides).findIndex(s => s.classList.contains('is-active'));
    if (index < 0) index = 0;

    const intervalMs = 3000;

    function goTo(n) {
        slides[index].classList.remove('is-active');
        if (dots[index]) {
            dots[index].classList.remove('is-active');
            dots[index].setAttribute('aria-selected', 'false');
        }
        index = ((n % slides.length) + slides.length) % slides.length;
        loadCarouselSlideImage(slides[index]);
        loadCarouselSlideImage(slides[(index + 1) % slides.length]);
        slides[index].classList.add('is-active');
        if (dots[index]) {
            dots[index].classList.add('is-active');
            dots[index].setAttribute('aria-selected', 'true');
        }
    }

    function next() {
        goTo(index + 1);
    }

    function start() {
        if (hero._carouselTimer) clearInterval(hero._carouselTimer);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
            hero._carouselTimer = setInterval(next, intervalMs);
        }
    }

    if (hero.dataset.carouselListeners !== '1') {
        hero.dataset.carouselListeners = '1';

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goTo(i);
                start();
            });
        });

        hero.addEventListener('mouseenter', () => {
            if (hero._carouselTimer) clearInterval(hero._carouselTimer);
            hero._carouselTimer = null;
        });

        hero.addEventListener('mouseleave', () => {
            start();
        });
    }

    loadCarouselSlideImage(slides[index]);
    loadCarouselSlideImage(slides[(index + 1) % slides.length]);

    if (restart || !hero._carouselTimer) {
        start();
    }
}

window.initHeroPhotoCarousel = initHeroPhotoCarousel;

function bootHeroCarousel() {
    const main = document.getElementById('main-content');
    if (!main || main.classList.contains('hidden')) return;
    initHeroPhotoCarousel(true);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHeroCarousel);
} else {
    bootHeroCarousel();
}

const SCHOOL_COORDS = [40.1348606, -7.5036193];
const SCHOOL_ZOOM = 18;

function initSchoolMap() {
    const container = document.getElementById('school-map');
    if (!container || container.dataset.mapReady === '1') return;
    if (typeof L === 'undefined') {
        setTimeout(initSchoolMap, 120);
        return;
    }

    const main = document.getElementById('main-content');
    if (main && main.classList.contains('hidden')) return;

    container.dataset.mapReady = '1';

    const map = L.map(container, {
        center: SCHOOL_COORDS,
        zoom: SCHOOL_ZOOM,
        scrollWheelZoom: false,
        zoomControl: true
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.65
    }).addTo(map);

    const markerIcon = L.divIcon({
        className: 'school-map-pin',
        html: '<span class="school-map-pin-dot"></span><span class="school-map-pin-label">EP Fundão</span>',
        iconSize: [120, 48],
        iconAnchor: [60, 44]
    });

    L.marker(SCHOOL_COORDS, { icon: markerIcon })
        .addTo(map)
        .bindPopup(
            '<strong>Escola Profissional do Fundão</strong><br>Rua Cidade de Salamanca, nº 1<br>6230-370 Fundão, Portugal'
        )
        .openPopup();

    container.addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
    container.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

    setTimeout(() => map.invalidateSize(), 200);
}

window.initSchoolMap = initSchoolMap;

function bootSchoolMap() {
    const main = document.getElementById('main-content');
    if (!main || main.classList.contains('hidden')) return;
    initSchoolMap();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSchoolMap);
} else {
    bootSchoolMap();
}
