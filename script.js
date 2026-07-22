/* ============================================================
   MHN — Portfolio 2026
   ============================================================ */

const html = document.documentElement;
html.classList.add('js'); // enables reveal initial states only when JS runs

/* ── Theme toggle ─────────────────────────────────────────── */
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

document.getElementById('themeToggle').addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ── Nav scroll state ─────────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu ──────────────────────────────────────────── */
const burger = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');

function setMenu(open) {
    burger.classList.toggle('open', open);
    menuOverlay.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    menuOverlay.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!menuOverlay.classList.contains('open')));
menuOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Escape is the expected way out of a full-screen menu, and it's the only
// route if the close control is ever obscured.
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('open')) setMenu(false);
});

/* ── Active nav link ──────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

/* ── Karachi clock ────────────────────────────────────────── */
function tickClock() {
    const t = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit'
    }).format(new Date());
    const a = document.getElementById('localTime');
    const b = document.getElementById('footTime');
    if (a) a.textContent = t;
    if (b) b.textContent = t;
}
tickClock();
setInterval(tickClock, 30000);

document.getElementById('year').textContent = new Date().getFullYear();

/* ── Scroll reveals ───────────────────────────────────────── */
const revealTargets = [];
document.querySelectorAll('.reveal-group, .section-head, .project, .more-card, .skill-row, .stat, .c-card, .edu-item, .about-copy, .edu, .contact-lead, .contact-form, .contact-or, .contact .section-tag, .t-card, .t-note, .service-row')
    .forEach(el => { el.classList.add('fade-up'); revealTargets.push(el); });
document.querySelectorAll('.line').forEach(el => revealTargets.push(el));

// Stagger siblings slightly via transition-delay
document.querySelectorAll('.work-featured, .more-grid, .stats, .contact-cards, .skills-rows, .edu-list, .t-grid, .service-list').forEach(group => {
    [...group.children].forEach((child, i) => {
        child.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
    });
});
document.querySelectorAll('.hero .line').forEach((line, i) => {
    line.querySelector('.line-inner').style.transitionDelay = `${150 + i * 120}ms`;
});
document.querySelectorAll('.contact .line').forEach((line, i) => {
    line.querySelector('.line-inner').style.transitionDelay = `${i * 120}ms`;
});

/* ── Stat counters ────────────────────────────────────────── */
function runCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    (function step(now) {
        const p = Math.max(0, Math.min((now - start) / duration, 1));
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
    })(start);
}

/* ── Reveal sweep ─────────────────────────────────────────────
   A plain position check rather than IntersectionObserver: a fast
   programmatic jump (nav link, page load on an anchor) can outrun the
   observer's async callbacks and leave a whole section stuck invisible.
   Anything whose top has passed the trigger line is revealed, no matter
   how it got there. */
let pending = revealTargets.slice();
let pendingCounters = [...document.querySelectorAll('.stat-num')];

function sweep() {
    const line = window.innerHeight * 0.92;
    if (pending.length) {
        pending = pending.filter(el => {
            if (el.getBoundingClientRect().top >= line) return true;
            el.classList.add('in');
            return false;
        });
    }
    if (pendingCounters.length) {
        pendingCounters = pendingCounters.filter(el => {
            if (el.getBoundingClientRect().top >= window.innerHeight * 0.85) return true;
            runCounter(el);
            return false;
        });
    }
}

let sweepQueued = false;
function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(() => { sweep(); sweepQueued = false; });
}
window.addEventListener('scroll', queueSweep, { passive: true });
window.addEventListener('resize', queueSweep, { passive: true });
window.addEventListener('load', sweep);
sweep();

/* ── Magnetic buttons (fine pointers only) ────────────────── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ── GSAP extras (progressive enhancement) ────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    // Subtle parallax on the hero orbs
    gsap.to('.orb-1', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.orb-2', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Marquee speeds up slightly while scrolling fast
    const track = document.querySelector('.marquee-track');
    if (track) {
        ScrollTrigger.create({
            trigger: '.marquee',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: self => {
                track.style.animationDuration = Math.abs(self.getVelocity()) > 800 ? '18s' : '30s';
            }
        });
    }
}

/* ── Contact form ─────────────────────────────────────────────
   Posts to Web3Forms. Until an access key is set, it falls back to
   opening a pre-filled email so the form is never a dead end.
   To activate: get a free key at https://web3forms.com (enter your
   email, they send it instantly) and paste it below. */
const WEB3FORMS_KEY = 'a3d80642-599c-4f89-abf9-0ec119f52432';
const CONTACT_EMAIL = 'huzaifakhan654916@gmail.com';

const form = document.getElementById('contactForm');
if (form) {
    const statusEl = document.getElementById('cf-status');
    const submitBtn = document.getElementById('cf-submit');

    const setError = (id, msg) => {
        const field = document.getElementById(id).closest('.field');
        field.classList.toggle('invalid', Boolean(msg));
        field.querySelector('.field-error').textContent = msg || '';
    };

    const fName = document.getElementById('cf-name');
    const fEmail = document.getElementById('cf-email');
    const fType = document.getElementById('cf-type');
    const fMsg = document.getElementById('cf-message');

    function validate() {
        let ok = true;
        const name = fName.value.trim();
        const email = fEmail.value.trim();
        const message = fMsg.value.trim();

        setError('cf-name', name ? '' : 'Please enter your name.');
        if (!name) ok = false;

        // Deliberately loose: strict email regexes reject valid addresses.
        setError('cf-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = false;

        setError('cf-message', message.length >= 10 ? '' : 'Please add a little more detail.');
        if (message.length < 10) ok = false;

        return ok;
    }

    ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
        document.getElementById(id).addEventListener('blur', validate);
    });

    function mailtoFallback() {
        const subject = `Portfolio enquiry — ${fType.value}`;
        const body =
            `Name: ${fName.value}\n` +
            `Email: ${fEmail.value}\n` +
            `Type: ${fType.value}\n\n` +
            fMsg.value;
        window.location.href =
            `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        statusEl.textContent = 'Opening your email app…';
        statusEl.className = 'form-status';
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (form.querySelector('.hp').checked) return;      // honeypot tripped
        if (!validate()) {
            statusEl.textContent = 'Please fix the highlighted fields.';
            statusEl.className = 'form-status err';
            return;
        }

        if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') {
            mailtoFallback();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        statusEl.textContent = 'Sending…';
        statusEl.className = 'form-status';

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: `Portfolio enquiry — ${fType.value}`,
                    from_name: fName.value,
                    name: fName.value,
                    email: fEmail.value,
                    project_type: fType.value,
                    message: fMsg.value
                })
            });
            const data = await res.json();
            if (data.success) {
                form.reset();
                statusEl.textContent = 'Thanks — I’ll get back to you within a day.';
                statusEl.className = 'form-status ok';
            } else {
                throw new Error(data.message || 'Send failed');
            }
        } catch (err) {
            statusEl.innerHTML =
                'Could not send. <a href="mailto:' + CONTACT_EMAIL + '" style="text-decoration:underline">Email me directly</a>.';
            statusEl.className = 'form-status err';
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
}
