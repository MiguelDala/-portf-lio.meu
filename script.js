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
    console.log('showMainContent chamada');
    
    // Esconder splash screen
    if (splashScreen) {
        splashScreen.classList.add('hidden');
        splashScreen.style.display = 'none';
        splashScreen.style.visibility = 'hidden';
        splashScreen.style.opacity = '0';
        splashScreen.style.zIndex = '-1';
        console.log('Splash screen escondida');
    }
    
    // Mostrar conteúdo principal
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
        mainContent.style.pointerEvents = 'auto';
        mainContent.style.position = 'relative';
        mainContent.style.height = 'auto';
        mainContent.style.zIndex = '1';
        mainContent.style.width = '100%';
        console.log('Conteúdo principal mostrado');
    }
    
    sessionStorage.setItem('portfolioEntered', 'true');
    
    // Scroll suave para o topo
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
    
    // Inicializar partículas após mostrar conteúdo
    setTimeout(() => {
        const particlesContainer = document.getElementById('floating-particles');
        if (particlesContainer && !particlesContainer.hasChildNodes()) {
            if (typeof createFloatingParticles === 'function') {
                createFloatingParticles();
            }
        }
    }, 500);
};

// Botão para entrar no portfólio
if (enterButton) {
    enterButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Botão clicado!');
        showMainContent();
    });
    
    // Também adicionar evento de mouse para garantir
    enterButton.addEventListener('mousedown', function(e) {
        e.preventDefault();
        showMainContent();
    });
} else {
    console.error('Botão enter-portfolio não encontrado!');
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

// Debug: Verificar se elementos existem
console.log('Splash Screen:', splashScreen);
console.log('Main Content:', mainContent);
console.log('Enter Button:', enterButton);

// Garantir que o botão seja clicável mesmo após animação
setTimeout(() => {
    if (enterButton) {
        enterButton.style.pointerEvents = 'auto';
        enterButton.style.cursor = 'pointer';
        enterButton.style.opacity = '1';
        console.log('Botão configurado e pronto para uso');
    }
}, 1200); // Após a animação do botão

// Fallback: Se após 5 segundos ainda estiver na splash, mostrar conteúdo automaticamente
setTimeout(() => {
    if (splashScreen && !splashScreen.classList.contains('hidden')) {
        console.log('Fallback: Mostrando conteúdo automaticamente após 5 segundos');
        showMainContent();
    }
}, 5000);

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
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Back to top button functionality
const backToTopButton = document.getElementById('back-to-top');
// Moved to optimized scroll handler below

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

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

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Animate project cards on scroll with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
            entry.target.classList.add('fade-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-mosaic-item, .skill-bar, .featured-project').forEach(card => {
    observer.observe(card);
});

// Lazy-load all images except the profile image (already visible)
document.querySelectorAll('img').forEach(img => {
    const isHeroProfile = img.closest('.profile-image');
    if (!isHeroProfile) {
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

// Contact form: send via mailto with prefilled subject/body
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const [nameInput, emailInput, messageInput] = contactForm.querySelectorAll('input, textarea');
        const name = encodeURIComponent(nameInput.value.trim());
        const email = encodeURIComponent(emailInput.value.trim());
        const message = encodeURIComponent(messageInput.value.trim());

        const subject = `Contato via portfólio - ${name || 'Sem nome'}`;
        const body = `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`;
        const recipient = 'miguel@example.com'; // ajuste para o seu email real
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    });
}

// Footer year auto-update (keeps 2024 style but updates year dynamically)
const footerText = document.querySelector('footer p');
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = footerText.innerHTML.replace(/\b20\d{2}\b|\b19\d{2}\b/, String(currentYear));
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero.new-hero-layout');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

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
    // Header scroll effect
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        lastScroll = currentScroll;
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
    
    // Back to top button
    if (currentScroll > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ========================================
// FLOATING PARTICLES SYSTEM
// ========================================
function createFloatingParticles() {
    const particlesContainer = document.getElementById('floating-particles');
    if (!particlesContainer) return;
    
    const particleCount = 15;
    const techIcons = [
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg'
    ];
    
    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 4; // 4px to 12px
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 15; // 15s to 35s
        const delay = Math.random() * 5;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    // Create floating tech icons in hero section
    const floatingIconsContainer = document.querySelector('.floating-tech-icons');
    if (floatingIconsContainer) {
        techIcons.forEach((iconSrc, index) => {
            const icon = document.createElement('img');
            icon.className = 'floating-icon';
            icon.src = iconSrc;
            icon.alt = 'Tech Icon';
            icon.style.animationDelay = (index * 2) + 's';
            floatingIconsContainer.appendChild(icon);
        });
    }
}

// Initialize particles when main content is visible
function initParticles() {
    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.classList.contains('hidden')) {
        createFloatingParticles();
    } else {
        // Wait for splash screen to be hidden
        const checkInterval = setInterval(() => {
            const mainContent = document.getElementById('main-content');
            if (mainContent && !mainContent.classList.contains('hidden')) {
                createFloatingParticles();
                clearInterval(checkInterval);
            }
        }, 100);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// Reinitialize when entering portfolio (já está na função showMainContent)

// ========================================
// ENHANCED INTERACTIVE EFFECTS
// ========================================

// Add magnetic effect to cards
document.querySelectorAll('.project-mosaic-item, .timeline-content, .featured-project').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 10;
        const moveY = (y - centerY) / 10;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Add parallax effect to hero content
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const heroContent = document.querySelector('.hero-content');
    const profileImage = document.querySelector('.profile-image');
    
    if (heroContent) {
        heroContent.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
    }
    
    if (profileImage) {
        profileImage.style.transform = `translate(${-mouseX * 0.2}px, ${-mouseY * 0.2}px)`;
    }
});

// Add glow effect on scroll for sections
const sectionGlowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.boxShadow = `
                0 0 40px rgba(99, 102, 241, 0.2),
                0 0 80px rgba(139, 92, 246, 0.1)
            `;
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(section => {
    sectionGlowObserver.observe(section);
});

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
    
    // Start typing after hero animation
    setTimeout(type, 1500);
}

// Add sparkle effect on click
document.addEventListener('click', (e) => {
    if (e.target.closest('.project-mosaic-item, .timeline-content, .social-button')) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        sparkle.style.boxShadow = `0 0 10px hsl(${Math.random() * 360}, 70%, 60%)`;
        
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 30 + Math.random() * 20;
        const duration = 0.6 + Math.random() * 0.4;
        
        sparkle.style.animation = `sparkleMove ${duration}s ease-out forwards`;
        sparkle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
        sparkle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), duration * 1000);
    }
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleMove {
        to {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);