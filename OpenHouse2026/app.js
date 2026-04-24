/* ═══════════════════════════════════════
   House Warming Invitation — app.js
   ═══════════════════════════════════════ */

// ── Background music ───────────────────────────────────────────
const bgMusic     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const iconOn      = musicToggle.querySelector('.music-icon--on');
const iconOff     = musicToggle.querySelector('.music-icon--off');

bgMusic.volume = 0.4;

// Always show the toggle button
musicToggle.classList.add('is-active');

function syncMusicIcon() {
  const muted = bgMusic.paused || bgMusic.muted;
  iconOn.style.display  = muted ? 'none'  : '';
  iconOff.style.display = muted ? ''      : 'none';
  musicToggle.setAttribute('aria-label', muted ? 'Mainkan muzik' : 'Redamkan muzik');
}

// Attempt autoplay on page load
bgMusic.play()
  .then(() => syncMusicIcon())
  .catch(() => {
    // Autoplay blocked by browser — music will start on first user interaction
    syncMusicIcon();
    const resumeOnInteraction = () => {
      bgMusic.play().then(() => syncMusicIcon()).catch(() => {});
      document.removeEventListener('click', resumeOnInteraction);
    };
    document.addEventListener('click', resumeOnInteraction);
  });

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // prevent triggering the resumeOnInteraction listener
  if (bgMusic.paused) {
    bgMusic.play().then(() => syncMusicIcon()).catch(() => {});
  } else {
    bgMusic.pause();
    syncMusicIcon();
  }
});

// ── Cover → Invitation reveal ──────────────────────────────────
const cover          = document.getElementById('cover');
const invitation     = document.getElementById('invitation');
const openInviteBtn  = document.getElementById('openInvitation');

openInviteBtn.addEventListener('click', () => {
  // Show invitation underneath before the page flips
  invitation.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  initFadeIns();

  // Trigger the book page-turn animation on the cover
  cover.classList.add('page-turning');

  // Hide cover once the flip animation finishes
  cover.addEventListener('animationend', () => {
    cover.style.display = 'none';
  }, { once: true });
});

// ── Scroll-triggered fade-in ───────────────────────────────────
function initFadeIns() {
  const els = document.querySelectorAll('.fade-in');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el, i) => {
    // Stagger delay so elements don't all pop at once
    el.style.transitionDelay = `${i * 0.06}s`;
    observer.observe(el);
  });
}

// ── Directions modal ───────────────────────────────────────────
const openDirectionsBtn = document.getElementById('openDirections');
const modal             = document.getElementById('directionsModal');

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Move focus to first interactive element inside modal
  const firstFocusable = modal.querySelector('a, button');
  if (firstFocusable) firstFocusable.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (openDirectionsBtn) openDirectionsBtn.focus();
}

openDirectionsBtn.addEventListener('click', openModal);

// Close via backdrop or any [data-close] element
modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});
