const menuDrawer = document.querySelector('.nav-drawer');
const menuButton = menuDrawer.querySelector('summary');

menuDrawer.querySelector('nav').addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;

  menuDrawer.open = false;
  const section = document.getElementById(link.hash.slice(1));
  section.setAttribute('tabindex', '-1');
  section.focus({preventScroll: true});
});

document.addEventListener('click', (event) => {
  if (menuDrawer.open && !menuDrawer.contains(event.target)) {
    menuDrawer.open = false;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuDrawer.open) {
    menuDrawer.open = false;
    menuButton.focus();
  }
});

window.matchMedia('(min-width: 768px)').addEventListener('change', () => {
  menuDrawer.open = false;
});

const themeToggle = document.querySelector('.theme-toggle');

if (CSS.supports('color', 'light-dark(white, black)')) {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'portfolio-theme';

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {
    // A blocked storage API still allows switching themes for the current visit.
  }

  const activeTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');

  const updateThemeControl = () => {
    themeToggle.setAttribute('aria-pressed', String(activeTheme() === 'dark'));
    themeColor.content = getComputedStyle(document.body).backgroundColor;
  };

  themeToggle.addEventListener('click', () => {
    root.dataset.theme = activeTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(storageKey, root.dataset.theme);
    } catch {
      // The theme remains active until the page is closed or reloaded.
    }
    updateThemeControl();
  });

  systemDark.addEventListener('change', updateThemeControl);
  updateThemeControl();
  themeToggle.hidden = false;
}

function openCaseFromHash() {
  const target = document.getElementById(window.location.hash.slice(1));
  if (target?.matches('details.project-details')) target.open = true;
}

openCaseFromHash();
window.addEventListener('hashchange', openCaseFromHash);

const contactForm = document.querySelector('.contact-form');

if (contactForm && typeof window.fetch === 'function') {
  const sendButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector('.form-status');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (sendButton.disabled) return;

    const emptyField = ['name', 'message']
      .map((name) => contactForm.elements.namedItem(name))
      .find((field) => !field.value.trim());

    if (emptyField) {
      status.dataset.state = 'error';
      status.textContent = emptyField.name === 'name' ? 'Enter your name.' : 'Enter a message.';
      emptyField.focus();
      return;
    }

    sendButton.disabled = true;
    status.dataset.state = 'pending';
    status.textContent = 'Sending your message…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('The contact service could not send the message.');
      }

      contactForm.reset();
      status.dataset.state = 'success';
      status.textContent = 'Message sent. I’ll be in touch.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your message couldn’t be sent. Try again or use the email link.';
    } finally {
      sendButton.disabled = false;
    }
  });
}
