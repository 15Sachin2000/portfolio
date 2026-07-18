/**
 * Portfolio Interactions — Sachin Kanyal
 * Sleek, high-performance vanilla JS with custom cursor, 3D card tilt, particles, and marquee belts.
 */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====================================================================
     1. Custom Interactive Cursor (Desktop Only)
     ==================================================================== */
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');
  let mx = 0, my = 0; // actual mouse pos
  let rx = 0, ry = 0; // smoothed pos for trailing ring

  if (cd && cr && !prefersReducedMotion && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cd.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cd.style.opacity = '1';
      cr.style.opacity = '1';
    }, { passive: true });

    // Smooth loop for trailing ring using GPU composited translate3d
    const smoothCursor = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cr.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(smoothCursor);
    };
    smoothCursor();
  }

  /* ====================================================================
     2. Scroll Progress Bar
     ==================================================================== */
  const sp = document.getElementById('sp');
  if (sp) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      sp.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ====================================================================
     3. Navigation
     ==================================================================== */
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Header glassmorphism on scroll
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active');
    });
  }

  // Close mobile nav on link click & active state highlight
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      if (nav) nav.classList.remove('active');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const activateLink = (id) => {
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activateLink(entry.target.id);
      });
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ====================================================================
     4. Scroll Reveal Animations
     ==================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ====================================================================
     5. Typing Effect
     ==================================================================== */
  const typingEl = document.querySelector('.typing-text');

  if (typingEl && !prefersReducedMotion) {
    const fullText = typingEl.textContent;
    typingEl.textContent = '';
    typingEl.style.borderRight = '2px solid var(--accent-primary)';

    let i = 0;
    const type = () => {
      if (i < fullText.length) {
        typingEl.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, 80);
      } else {
        typingEl.classList.add('typed');
      }
    };
    setTimeout(type, 600);
  }

  /* ====================================================================
     6. Count-Up Animation (Impact Metrics)
     ==================================================================== */
  const countUpElements = document.querySelectorAll('.count-up');
  let countersStarted = false;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const formatNumber = (num) => {
    return num >= 1000 ? num.toLocaleString('en-IN') : String(num);
  };

  const animateCountUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target);
      }
    };

    requestAnimationFrame(tick);
  };

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    if (prefersReducedMotion) {
      countUpElements.forEach(el => {
        el.textContent = formatNumber(parseInt(el.dataset.target, 10));
      });
    } else {
      countUpElements.forEach((el, idx) => {
        setTimeout(() => animateCountUp(el), idx * 150);
      });
    }
  };

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(impactSection);
  }

  /* ====================================================================
     7. Dynamic Skills Marquee Belts
     ==================================================================== */
  const languages = ['TypeScript', 'JavaScript (ES6+)', 'Python', 'HTML5', 'CSS3 / SCSS', 'SQL', 'C++'];
  const frontendMobile = ['React', 'Redux', 'React Native', 'Immutable.js', 'Storybook', 'AG-Grid'];
  const buildDevOpsPlatform = ['Vite', 'Webpack', 'GitHub Actions CI / CD', 'Sentry', 'Performance Optimization', 'Design Systems', 'Mobile Engineering'];

  const makeBelt = (id, items) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Double array to create a seamless infinite marquee scroll loop
    const all = [...items, ...items, ...items];
    el.innerHTML = all.map(s => `
      <div class="skill-chip">
        <span class="chip-dot"></span>
        ${s}
      </div>
    `).join('');
  };

  makeBelt('b1', languages);
  makeBelt('b2', frontendMobile);
  makeBelt('b3', buildDevOpsPlatform);

  /* ====================================================================
     8. Interactive Particle Canvas Background (Hero)
     ==================================================================== */
  const canvas = document.getElementById('hc');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const particleCount = 80; // High-performance count
    let pmx = 0, pmy = 0; // Mouse position

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.a = Math.random() * 0.5 + 0.3; // Base opacity
      }

      update() {
        // Bounce off bounds
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;

        // Mouse repulsion
        const dx = this.x - pmx;
        const dy = this.y - pmy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.vx += (dx / dist) * force * 0.1;
          this.vy += (dy / dist) * force * 0.1;
        }

        // Apply velocity damping and update coordinates
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 71, 87, ${this.a})`; // Crimson colored node
        ctx.fill();
      }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Update mouse coords relative to canvas
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pmx = e.clientX - rect.left;
      pmy = e.clientY - rect.top;
    }, { passive: true });

    // Main draw loop
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Opacity proportional to distance
            ctx.strokeStyle = `rgba(255, 71, 87, ${0.04 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }

  /* ====================================================================
     9. Parallax Scroll Effect
     ==================================================================== */
  if (!prefersReducedMotion) {
    const heroInner = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (heroInner && s < window.innerHeight) {
        heroInner.style.transform = `translateY(${s * 0.16}px)`;
      }
      if (canvas && s < window.innerHeight) {
        canvas.style.transform = `translateY(${s * 0.08}px)`;
      }
    }, { passive: true });
  }

  /* ====================================================================
     10. 3D Card Tilt Effect
     ==================================================================== */
  const cards = document.querySelectorAll('.glass-card');
  if (cards.length > 0 && !prefersReducedMotion && window.innerWidth > 768) {
    cards.forEach(c => {
      c.addEventListener('mousemove', (e) => {
        const rect = c.getBoundingClientRect();
        // Mouse coordinate percent relative to card center
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Calculate rotation angles (max 6 degrees to keep it professional)
        const xAngle = (x - 0.5) * 12;
        const yAngle = (y - 0.5) * -12;

        c.style.transform = `perspective(1000px) rotateY(${xAngle}deg) rotateX(${yAngle}deg) translateZ(8px) translateY(-2px)`;
      });

      c.addEventListener('mouseleave', () => {
        c.style.transform = '';
      });
    });
  }

  /* ====================================================================
     11. Contact Form — Web3Forms AJAX Submit
     ==================================================================== */
  const contactForm = document.querySelector('.contact-form');

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3500);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('#name');
      const emailInput = contactForm.querySelector('#email');
      const messageInput = contactForm.querySelector('#message');
      let hasError = false;

      [nameInput, emailInput, messageInput].forEach(input => {
        if (input) input.classList.remove('input-error');
      });

      if (nameInput && !nameInput.value.trim()) {
        nameInput.classList.add('input-error');
        hasError = true;
      }
      if (emailInput && !isValidEmail(emailInput.value)) {
        emailInput.classList.add('input-error');
        hasError = true;
      }
      if (messageInput && !messageInput.value.trim()) {
        messageInput.classList.add('input-error');
        hasError = true;
      }

      if (hasError) {
        showToast('Please fill in all fields correctly.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        })
        .then(async (response) => {
          const res = await response.json();
          if (response.status === 200) {
            showToast('Message sent! I\'ll get back to you soon. 🚀');
            contactForm.reset();
          } else {
            showToast(res.message || 'Something went wrong.', 'error');
          }
        })
        .catch(() => {
          showToast('Failed to send message. Please try again.', 'error');
        })
        .then(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
      }
    });
  }
});
