// ── Theme Toggle ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ── Custom Magnetic Effects ──────────────────────
// Magnetic Buttons
const magneticButtons = document.querySelectorAll('.btn, .project-btn, .social-link');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = `translate(0px, 0px)`;
    });
});

// Smooth scroll for navigation links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ── GSAP ScrollTrigger Registration ──────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Text Reveal: Split text into letters ─────────────────
document.querySelectorAll('.text-reveal').forEach(el => {
    // Preserve the gradient-text span inside hero-title
    if (el.classList.contains('hero-title')) {
        const html = el.innerHTML;
        // Split text nodes into letters, keep <span> tags intact
        let result = '';
        let insideTag = false;
        let tagContent = '';
        
        for (let i = 0; i < html.length; i++) {
            const char = html[i];
            if (char === '<') {
                insideTag = true;
                tagContent += char;
            } else if (char === '>') {
                insideTag = false;
                tagContent += char;
                
                // Check if it's an opening gradient-text span
                if (tagContent.includes('class="gradient-text"')) {
                    // Extract text content between open/close span tags
                    const closeIdx = html.indexOf('</span>', i);
                    const innerText = html.substring(i + 1, closeIdx);
                    const letters = innerText.split('').map(c => 
                        c === ' ' ? '<span class="letter-space"></span>' : 
                        `<span class="letter">${c}</span>`
                    ).join('');
                    result += `<span class="gradient-text">${letters}</span>`;
                    i = closeIdx + '</span>'.length - 1;
                } else if (tagContent.includes('</')) {
                    // Skip closing tags (already handled)
                } else {
                    result += tagContent;
                }
                tagContent = '';
            } else if (insideTag) {
                tagContent += char;
            } else {
                // Regular text outside tags
                if (char === ' ') {
                    result += '<span class="letter-space"></span>';
                } else {
                    result += `<span class="letter">${char}</span>`;
                }
            }
        }
        el.innerHTML = result;
    } else {
        const text = el.textContent;
        el.innerHTML = text.split('').map(char => 
            char === ' ' ? '<span class="letter-space"></span>' : 
            `<span class="letter">${char}</span>`
        ).join('');
    }
});

// ── Hero Entrance Animation (Cinematic) ──────────────────
const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTl
    .from('.hero-badge', { 
        y: 30, opacity: 0, duration: 0.8 
    })
    .to('.hero-title .letter', {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'back.out(1.5)'
    }, '-=0.3')
    .to('.hero-subtitle .letter', {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.5)'
    }, '-=0.3')
    .from('.hero-description', {
        y: 20, opacity: 0, duration: 0.8
    }, '-=0.2')
    .from('.hero-buttons .btn', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.15
    }, '-=0.4')
    .from('.social-link', {
        y: 15, opacity: 0, duration: 0.4, stagger: 0.1
    }, '-=0.3')
    .from('.hero-image', {
        x: 80, opacity: 0, duration: 1, ease: 'power3.out'
    }, '-=0.8')
    .from('.scroll-indicator', {
        y: 20, opacity: 0, duration: 0.6
    }, '-=0.3');

// ── Section Title Reveals (on scroll) ────────────────────
document.querySelectorAll('section .text-reveal').forEach(el => {
    // Skip hero elements (they animate on page load)
    if (el.closest('.hero')) return;
    
    const letters = el.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    gsap.to(letters, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: 'back.out(1.5)',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Section Badges (slide up) ────────────────────────────
gsap.utils.toArray('.section-badge').forEach(badge => {
    gsap.from(badge, {
        y: 30, opacity: 0, duration: 0.6,
        scrollTrigger: {
            trigger: badge,
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Section Descriptions ─────────────────────────────────
gsap.utils.toArray('.section-description').forEach(desc => {
    gsap.from(desc, {
        y: 20, opacity: 0, duration: 0.8,
        scrollTrigger: {
            trigger: desc,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ── About Text (paragraphs slide in) ─────────────────────
gsap.utils.toArray('.about-intro, .about-description').forEach((p, i) => {
    gsap.from(p, {
        x: -50, opacity: 0, duration: 0.8,
        delay: i * 0.15,
        scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Stat Cards (count up + scale in) ─────────────────────
document.querySelectorAll('.stat-card').forEach((card, i) => {
    gsap.from(card, {
        y: 40, opacity: 0, scale: 0.9, duration: 0.6,
        delay: i * 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            onEnter: () => {
                // Count-up animation
                const numEl = card.querySelector('.stat-number');
                if (numEl && numEl.dataset.count) {
                    const target = parseInt(numEl.dataset.count);
                    const suffix = numEl.dataset.suffix || '';
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: () => {
                            numEl.textContent = Math.round(obj.val) + suffix;
                        }
                    });
                }
            }
        }
    });
});

// ── Skill Categories (stagger from below) ────────────────
gsap.utils.toArray('.skill-category').forEach((cat, i) => {
    gsap.from(cat, {
        y: 60, opacity: 0, scale: 0.95, duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: cat,
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Project Cards (alternate left/right fly-in) ──────────
document.querySelectorAll('.project-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(card, {
        x: fromLeft ? -100 : 100,
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Education Timeline (cascade in from left) ────────────
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
        x: -60, opacity: 0, duration: 0.7,
        delay: i * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Contact Cards (stagger scale-in) ─────────────────────
gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, {
        y: 50, opacity: 0, scale: 0.9, duration: 0.6,
        delay: i * 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
});

// ── Parallax Gradient Orbs ───────────────────────────────
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        gsap.to(orb, { x, y, duration: 1, ease: 'power2.out' });
    });
});

// ── Smooth reveal animation to timeline items ────────────
const timelineItems = document.querySelectorAll('.timeline-item');
// (Already handled by GSAP above)

// ── Skill tags hover effect ──────────────────────────────
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        gsap.to(this, { scale: 1.1, duration: 0.2, ease: 'power2.out' });
    });
    
    tag.addEventListener('mouseleave', function() {
        gsap.to(this, { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
});

// ── Project cards tilt effect on hover ───────────────────
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        gsap.to(this, {
            rotateX, rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            rotateX: 0, rotateY: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ── Page Load Animation ──────────────────────────────────
gsap.from('body', { opacity: 0, duration: 0.6, ease: 'power2.out' });

// ── Smooth scroll indicator hide on scroll ───────────────
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    ScrollTrigger.create({
        start: 200,
        onUpdate: (self) => {
            gsap.to(scrollIndicator, {
                opacity: self.progress > 0 ? 0 : 1,
                pointerEvents: self.progress > 0 ? 'none' : 'auto',
                duration: 0.3
            });
        }
    });
}
