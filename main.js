/* ═══════════════════════════════════════════════════════════════
   Contrary Downloader — Website JS
   Scroll animations, FAQ toggle, download popup, GitHub API
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Scroll-triggered pop-in / slide-up animations ──
  const animEls = document.querySelectorAll('.anim-pop, .anim-slide');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach((el) => observer.observe(el));

  // ── Floating nav scroll effect ──
  const nav = document.getElementById('floating-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Hero particles ──
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'sp';
      const size = Math.random() * 4 + 2;
      const isGold = Math.random() > 0.4;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${isGold ? 'rgba(196,146,80,0.7)' : 'rgba(130,55,210,0.6)'};
        box-shadow: 0 0 ${size * 2}px ${isGold ? 'rgba(196,146,80,0.5)' : 'rgba(130,55,210,0.4)'};
        animation-duration: ${8 + Math.random() * 14}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  // ── FAQ toggle ──
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach((el) => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── Download popup wiring ──
  const overlay = document.getElementById('dl-overlay');
  const dlModal = document.getElementById('dl-modal');

  function openDownloadPopup() {
    overlay.classList.remove('hidden');
  }
  function closeDownloadPopup() {
    overlay.classList.add('hidden');
  }

  // All download buttons open the popup
  ['hero-dl-btn', 'nav-dl-btn', 'bottom-dl-btn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => {
      e.preventDefault();
      openDownloadPopup();
    });
  });

  document.getElementById('dl-close').addEventListener('click', closeDownloadPopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDownloadPopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDownloadPopup();
  });

  // Helper: trigger a real download via temp anchor
  function triggerDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 200);
  }

  // ── Setup button: fetch latest .exe from GitHub releases ──
  document.getElementById('dl-setup').addEventListener('click', async () => {
    try {
      const res = await fetch('https://api.github.com/repos/AroseEditor/Contrary-Downloader/releases/latest');
      const data = await res.json();
      const asset = data.assets.find((a) => a.name.endsWith('.exe'));
      if (asset) {
        triggerDownload(asset.browser_download_url);
      } else {
        window.open(data.html_url, '_blank');
      }
    } catch {
      window.open('https://github.com/AroseEditor/Contrary-Downloader/releases/latest', '_blank');
    }
  });

  // ── Portable button: direct Discord CDN link ──
  document.getElementById('dl-portable').addEventListener('click', () => {
    triggerDownload('https://cdn.discordapp.com/attachments/1401324987071336510/1498678873028821188/Contrary_Downloader.exe?ex=69fa9ab7&is=69f94937&hm=31ac545a180be9916ef048579bf4128165830f48050bdb955519e4ca098b02a2&');
  });

  // ── Bottom CTA "scroll to top" visual connection ──
  // The bottom download button opens the popup (already wired above)

})();
