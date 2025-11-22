// script.js — full replacement
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper');
  const btnPopup = document.querySelector('.btnLogin-popup');
  const iconClose = document.querySelector('.icon-close');
  const registerLink = document.querySelector('.register-link');
  const loginLink = document.querySelector('.login-link');
  // nav anchors (all links inside nav.navigation)
  const navAnchors = document.querySelectorAll('nav.navigation a[href]');

  // Sections to hide/show while modal is open
  const welcomeSection = document.querySelector('#welcome-section');
  const contactSection = document.querySelector('#contact');
  const footer = document.querySelector('footer');

  // Form wrappers and forms
  const loginWrapper = document.getElementById('login-form-wrapper');
  const registerWrapper = document.getElementById('register-form-wrapper');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // First inputs (for focusing)
  const firstLoginInput = document.getElementById('login-email');
  const firstRegisterInput = document.getElementById('register-username');

  let lastFocusedElement = null;

  // ---------- Helpers ----------
  function hidePageContent() {
    if (welcomeSection) welcomeSection.style.display = 'none';
    if (contactSection) contactSection.style.display = 'none';
    if (footer) footer.style.display = 'none';
  }

  function showPageContent() {
    if (welcomeSection) welcomeSection.style.display = '';
    if (contactSection) contactSection.style.display = '';
    if (footer) footer.style.display = '';
  }

  function isOpen() {
    return wrapper && !wrapper.hasAttribute('hidden') && wrapper.classList.contains('active-popup');
  }

  function openDialog(showRegister = false) {
    if (!wrapper) return;

    lastFocusedElement = document.activeElement;
    hidePageContent();

    wrapper.removeAttribute('hidden');
    wrapper.classList.add('active-popup');
    document.body.style.overflow = 'hidden';

    if (showRegister) {
      registerWrapper?.removeAttribute('hidden');
      wrapper.classList.add('active');
      setTimeout(() => firstRegisterInput?.focus(), 150);
    } else {
      wrapper.classList.remove('active');
      setTimeout(() => {
        registerWrapper?.setAttribute('hidden', '');
        firstLoginInput?.focus();
      }, 150);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focus', focusTrap, true);
  }

  function closeDialog() {
    if (!wrapper) return;
    wrapper.classList.remove('active-popup');
    wrapper.classList.remove('active');

    setTimeout(() => {
      wrapper.setAttribute('hidden', '');
      registerWrapper?.setAttribute('hidden', '');
      showPageContent();

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }, 300);

    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('focus', focusTrap, true);
    document.body.style.overflow = '';
  }

  function showRegisterPanel() {
    if (!wrapper || wrapper.hasAttribute('hidden')) {
      openDialog(true);
      return;
    }
    registerWrapper?.removeAttribute('hidden');
    wrapper.classList.add('active');
    setTimeout(() => firstRegisterInput?.focus(), 120);
  }

  function showLoginPanel() {
    wrapper.classList.remove('active');
    setTimeout(() => {
      registerWrapper?.setAttribute('hidden', '');
      firstLoginInput?.focus();
    }, 150);
  }

  // ---------- Keyboard & Focus ----------
  function handleKeyDown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeDialog();
    }
  }

  function focusTrap(e) {
    if (!isOpen()) return;
    if (!wrapper.contains(e.target)) {
      const focusable = wrapper.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        focusable[0].focus();
      } else {
        wrapper.focus();
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // ---------- Event bindings ----------
  if (btnPopup) {
    // btn on nav opens login modal
    btnPopup.addEventListener('click', (e) => {
      // If it's an <a> linking to index.html?auth=login, the browser will navigate - handled elsewhere.
      // If it's a button (in-page), open modal.
      e.preventDefault();
      openDialog(false);
    });
  }

  if (iconClose) {
    iconClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeDialog();
    });
  }

  // Close when clicking outside the popup
  if (wrapper) {
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) closeDialog();
    });
  }

  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      showRegisterPanel();
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginPanel();
    });
  }

  // Unblock nav anchors so they always navigate even while modal is open
  // If an anchor has href="#" we keep the old behavior (scroll to top); otherwise we allow normal navigation.
  if (navAnchors && navAnchors.length) {
    navAnchors.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href')?.trim() ?? '';
        // treat same-page placeholder anchors as special
        if (!href || href === '#') {
          e.preventDefault();
          if (isOpen()) closeDialog();
          showPageContent();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        // Normal link -> allow navigation. If modal open, close it first then let browser navigate.
        if (isOpen()) closeDialog();
        // do not call preventDefault() so the browser navigates normally
      });
    });
  }

  // ---------- Form handlers (demo) ----------
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.reportValidity?.();
        return;
      }
      const formData = new FormData(loginForm);
      const email = (formData.get('email') || '').toString().trim();
      const password = (formData.get('password') || '').toString();

      if (email && password) {
        alert('Login successful! (demo)');
        closeDialog();
        loginForm.reset();
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        registerForm.reportValidity?.();
        return;
      }
      const formData = new FormData(registerForm);
      const username = (formData.get('username') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const password = (formData.get('password') || '').toString();
      const termsAccepted = formData.get('agree_terms') !== null;

      if (username && email && password && termsAccepted) {
        alert('Registration successful! (demo)');
        closeDialog();
        registerForm.reset();
      } else {
        alert('Please fill in all fields and accept the terms.');
      }
    });
  }

  // ---------- Initialization ----------
  if (wrapper && !wrapper.hasAttribute('hidden')) {
    wrapper.setAttribute('hidden', '');
  }
  if (registerWrapper && !registerWrapper.hasAttribute('hidden')) {
    registerWrapper.setAttribute('hidden', '');
  }

  // ---------- URL param handling (open modal when index.html?auth=login or ?auth=register) ----------
  (function openFromUrlParam() {
    try {
      const params = new URLSearchParams(window.location.search);
      const auth = params.get('auth'); // 'login' or 'register'
      if (auth === 'login') {
        // open login modal
        openDialog(false);
        // remove param so refresh doesn't re-open
        history.replaceState(null, '', window.location.pathname + window.location.hash);
      } else if (auth === 'register') {
        openDialog(true);
        history.replaceState(null, '', window.location.pathname + window.location.hash);
      }
    } catch (err) {
      // ignore (very old browsers)
      // console.warn('Auth param check failed', err);
    }
  })();
});
