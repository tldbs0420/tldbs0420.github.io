const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-engine]');
for (const button of filters) {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    let count = 0;
    for (const card of cards) {
      const visible = selected === 'all' || card.dataset.engine === selected;
      card.hidden = !visible;
      if (visible) count++;
    }
    for (const filter of filters) {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    }
    document.querySelector('.filter-count').textContent = `${count} PROJECTS`;
  });
}
// Track headings in document order, including subsection anchors.
const tocLinks = [...document.querySelectorAll('.toc-navigation a[href^="#"]')];
const tocTargets = tocLinks.map(link => ({link, target: document.getElementById(link.hash.slice(1))})).filter(item => item.target);
if (tocTargets.length) {
  let scheduled = false;
  const updateToc = () => {
    scheduled = false;
    const header = document.querySelector('.site-header');
    const threshold = (header?.getBoundingClientRect().height || 0) + 66;
    let current = null;
    for (const item of tocTargets) {
      if (item.target.getBoundingClientRect().top <= threshold) current = item;
    }
    for (const {link} of tocTargets) {
      const active = link === current?.link;
      link.classList.toggle('current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    for (const group of document.querySelectorAll('.toc-group')) {
      group.classList.toggle('has-current', !!group.querySelector('.current'));
    }
  };
  const scheduleToc = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateToc); }
  };
  window.addEventListener('scroll', scheduleToc, { passive: true });
  window.addEventListener('resize', scheduleToc);
  window.addEventListener('hashchange', scheduleToc);
  window.addEventListener('load', scheduleToc);
  updateToc();
}

// Projects remains a normal link. The adjacent disclosure also works on touch.
const projectMenu = document.querySelector('[data-project-menu]');
if (projectMenu) {
  const toggle = projectMenu.querySelector('.project-menu-toggle');
  const dropdown = projectMenu.querySelector('.project-dropdown');
  const setMenuOpen = (open) => {
    dropdown.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', `프로젝트 바로가기 목록 ${open ? '닫기' : '열기'}`);
  };
  projectMenu.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') setMenuOpen(true);
  });
  projectMenu.addEventListener('pointerleave', () => {
    if (!projectMenu.contains(document.activeElement)) setMenuOpen(false);
  });
  projectMenu.addEventListener('focusin', (event) => {
    if (event.target !== toggle) setMenuOpen(true);
  });
  projectMenu.addEventListener('focusout', (event) => {
    if (!projectMenu.contains(event.relatedTarget)) setMenuOpen(false);
  });
  toggle.addEventListener('click', () => setMenuOpen(dropdown.hidden));
  projectMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!projectMenu.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dropdown.hidden) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}

// Mixed media gallery: manual navigation, selected thumbnail, and one player at a time.
for (const gallery of document.querySelectorAll('[data-media-gallery]')) {
  const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
  const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  const previous = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  const rail = gallery.querySelector('.gallery-thumbnails');
  const caption = gallery.querySelector('[data-gallery-caption]');
  const position = gallery.querySelector('[data-gallery-position]');
  const announcement = gallery.querySelector('[data-gallery-announcement]');
  const stage = gallery.querySelector('.gallery-stage');
  if (!slides.length) continue;
  let selected = -1;
  const count = slides.length;
  previous.disabled = next.disabled = count < 2;

  const select = (index, interactive = true, focusThumbnail = false) => {
    const target = (index + count) % count;
    if (target === selected) return;
    if (selected >= 0) {
      const outgoing = slides[selected];
      for (const player of outgoing.querySelectorAll('video')) player.pause();
      for (const embed of outgoing.querySelectorAll('iframe[data-gallery-embed]')) embed.removeAttribute('src');
    }
    selected = target;
    for (let i = 0; i < count; i++) {
      const active = i === selected;
      slides[i].hidden = !active;
      thumbs[i].classList.toggle('is-active', active);
      thumbs[i].setAttribute('aria-pressed', String(active));
    }
    const current = slides[selected];
    for (const embed of current.querySelectorAll('iframe[data-gallery-embed]')) {
      if (!embed.getAttribute('src')) embed.setAttribute('src', embed.dataset.galleryEmbed);
    }
    caption.textContent = current.dataset.caption;
    position.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    if (interactive) {
      announcement.textContent = `${count}개 중 ${selected + 1}번째 / ${current.dataset.caption}`;
      const thumb = thumbs[selected];
      const left = thumb.offsetLeft - (rail.clientWidth - thumb.offsetWidth) / 2;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      rail.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
      if (focusThumbnail) thumb.focus({ preventScroll: true });
    }
  };
  previous.addEventListener('click', () => select(selected - 1));
  next.addEventListener('click', () => select(selected + 1));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => select(index)));

  const onKeyDown = (event) => {
    // Preserve native media player shortcuts and link behavior.
    if (event.target.closest('video, iframe, a, input, textarea, select')) return;
    let target;
    if (event.key === 'ArrowLeft') target = selected - 1;
    else if (event.key === 'ArrowRight') target = selected + 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = count - 1;
    else return;
    event.preventDefault();
    select(target, true, !!event.target.closest('[data-gallery-thumb]'));
  };
  stage.addEventListener('keydown', onKeyDown);
  rail.addEventListener('keydown', onKeyDown);
  select(0, false);
}

// Lightweight GIF-like loops. Manual pauses persist across viewport changes.
const inlineClips = [...document.querySelectorAll('[data-inline-clip]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loadInlineClip = (clip) => {
  const source = clip.querySelector('source[data-src]');
  if (source && !source.getAttribute('src')) {
    source.src = source.dataset.src;
    clip.load();
  }
};
const userPausedClips = new WeakSet();
const playInlineClip = (clip) => clip.play().catch(() => {});
for (const clip of inlineClips) {
  const button = clip.closest('.clip-stage').querySelector('[data-clip-toggle]');
  const syncButton = () => {
    const label = clip.paused ? '시연 재생' : '시연 일시정지';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.firstElementChild.textContent = clip.paused ? '▶' : 'Ⅱ';
  };
  clip.addEventListener('play', syncButton);
  clip.addEventListener('pause', syncButton);
  button.addEventListener('click', () => {
    if (clip.paused) {
      userPausedClips.delete(clip);
      loadInlineClip(clip);
      playInlineClip(clip);
    } else {
      userPausedClips.add(clip);
      clip.pause();
    }
  });
  syncButton();
}
if ('IntersectionObserver' in window) {
  const visibleClips = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const clip = entry.target;
      if (entry.isIntersecting) {
        visibleClips.add(clip);
        loadInlineClip(clip);
        if (!reducedMotion.matches && !document.hidden && !userPausedClips.has(clip)) playInlineClip(clip);
      } else {
        visibleClips.delete(clip);
        clip.pause();
      }
    }
  }, {threshold: 0.2});
  inlineClips.forEach(clip => observer.observe(clip));
  document.addEventListener('visibilitychange', () => {
    for (const clip of visibleClips) {
      if (document.hidden) clip.pause();
      else if (!reducedMotion.matches && !userPausedClips.has(clip)) playInlineClip(clip);
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) inlineClips.forEach(clip => clip.pause());
    else if (!document.hidden) visibleClips.forEach(clip => {
      if (!userPausedClips.has(clip)) playInlineClip(clip);
    });
  });
} else {
  inlineClips.forEach(clip => {
    loadInlineClip(clip);
    if (!reducedMotion.matches) playInlineClip(clip);
  });
}

// Collapse the project contents on small screens so the article starts sooner.
(() => {
  const toc = document.querySelector('.detail-toc');
  const nav = toc && toc.querySelector('.toc-navigation');
  if (!nav) return;
  if (!nav.id) nav.id = 'toc-navigation';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toc-toggle';
  button.setAttribute('aria-controls', nav.id);
  const label = document.createElement('span');
  const sign = document.createElement('span');
  sign.setAttribute('aria-hidden', 'true');
  button.append(label, sign);
  const setOpen = open => {
    toc.classList.toggle('toc-open', open);
    button.setAttribute('aria-expanded', String(open));
    label.textContent = open ? '목차 접기' : '목차 펼치기';
    sign.textContent = open ? '−' : '+';
  };
  setOpen(false);
  nav.before(button);
  button.addEventListener('click', () => setOpen(!toc.classList.contains('toc-open')));
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 760px)').matches) setOpen(false);
  });
})();

// Hero play reel: label the project on screen and respect reduced motion.
(() => {
  const reel = document.querySelector('[data-hero-reel]');
  if (!reel) return;
  const video = reel.querySelector('video');
  const link = reel.querySelector('.hero-reel-link');
  const index = reel.querySelector('.hero-reel-index');
  const name = reel.querySelector('.hero-reel-name');
  const segments = [
    [0, 'eternal-mortis', 'Eternal Mortis'],
    [3.2, 'concrete-ascent', 'Concrete Ascent'],
    [6.0, 'section-null', 'Section Null'],
    [9.0, 'redline-rumble', 'Redline Rumble'],
    [11.8, 'rhythm-game', '리듬게임 프로젝트'],
  ];
  let current = -1;
  const update = () => {
    let next = 0;
    segments.forEach(([start], i) => { if (video.currentTime >= start) next = i; });
    if (next === current) return;
    current = next;
    const [, id, label] = segments[next];
    link.href = `projects/${id}.html`;
    index.textContent = `${String(next + 1).padStart(2, '0')} / ${String(segments.length).padStart(2, '0')}`;
    name.textContent = label;
  };
  video.addEventListener('timeupdate', update);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduce.matches) video.play().catch(() => {});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (reduce.matches) return;
      if (entry.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(reel);
  }
})();
