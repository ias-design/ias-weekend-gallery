const galleries = {
  austria2024:    { folder: 'photos/austria2024',    count: 0 },
  portugal2025:   { folder: 'photos/portugal2025',   count: 0 },
  switzerland2025:{ folder: 'photos/switzerland2025',count: 65 },
  greece2026:     { folder: 'photos/greece2026',     count: 0 }
};

const PASSWORD = 'ias-weekends';

let currentGallery = 'switzerland2025';
let lightboxPhotos = [];
let lightboxIndex = 0;

const pwScreen   = document.getElementById('password-screen');
const mainSite   = document.getElementById('main-site');
const pwInput    = document.getElementById('pw-input');
const pwBtn      = document.getElementById('pw-btn');
const pwError    = document.getElementById('pw-error');
const dropToggle = document.querySelector('.dropdown-toggle');
const dropMenu   = document.querySelector('.dropdown-menu');
const lightbox   = document.getElementById('lightbox');
const lbOverlay  = document.getElementById('lb-overlay');
const lbImg      = document.getElementById('lb-img');
const lbClose    = document.getElementById('lb-close');
const lbPrev     = document.getElementById('lb-prev');
const lbNext     = document.getElementById('lb-next');

function checkPassword() {
  if (pwInput.value.trim() === PASSWORD) {
    pwScreen.classList.add('hidden');
    mainSite.classList.remove('hidden');
    showGallery('switzerland2025');
  } else {
    pwError.style.display = 'block';
    pwInput.value = '';
    pwInput.focus();
  }
}

pwBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

dropToggle.addEventListener('click', e => {
  e.stopPropagation();
  dropMenu.classList.toggle('open');
});

document.addEventListener('click', () => dropMenu.classList.remove('open'));

dropMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const galleryId = link.dataset.gallery;
    showGallery(galleryId);
    dropMenu.classList.remove('open');
    dropMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    dropToggle.textContent = link.textContent + ' ▾';
  });
});

function showGallery(id) {
  currentGallery = id;
  // Hide all sections
  document.querySelectorAll('.gallery-section').forEach(s => {
    s.style.display = 'none';
  });
  // Show the selected one
  const section = document.getElementById(id);
  if (section) section.style.display = 'block';
  buildGrid(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildGrid(id) {
  const grid = document.getElementById('grid-' + id);
  if (!grid) return;
  if (grid.dataset.built === 'true') return;

  const { folder, count } = galleries[id];

  if (count === 0) {
    grid.innerHTML = '<p style="color:#aaa; font-size:0.85rem; letter-spacing:0.06em; padding: 20px 0;">Photos coming soon.</p>';
    grid.dataset.built = 'true';
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(3, '0');
    const src = folder + '/' + num + '.jpg';

    const item = document.createElement('div');
    item.className = 'photo-item';
    item.dataset.index = i - 1;

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Photo ' + i;
    img.loading = 'lazy';

    const dlBtn = document.createElement('a');
    dlBtn.className = 'dl-btn';
    dlBtn.href = src;
    dlBtn.download = num + '.jpg';
    dlBtn.title = 'Download photo';
    dlBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    dlBtn.addEventListener('click', e => e.stopPropagation());

    item.appendChild(img);
    item.appendChild(dlBtn);
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    fragment.appendChild(item);
  }

  grid.appendChild(fragment);
  grid.dataset.built = 'true';
}

function openLightbox(index) {
  const { folder, count } = galleries[currentGallery];
  lightboxPhotos = [];
  for (let i = 1; i <= count; i++) {
    lightboxPhotos.push(folder + '/' + String(i).padStart(3, '0') + '.jpg');
  }
  lightboxIndex = index;
  lbImg.src = lightboxPhotos[lightboxIndex];
  lightbox.classList.remove('hidden');
  lbOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lbOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxPhotos.length) % lightboxPhotos.length;
  lbImg.src = lightboxPhotos[lightboxIndex];
}

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', e => { e.stopPropagation(); lightboxNav(-1); });
lbNext.addEventListener('click', e => { e.stopPropagation(); lightboxNav(1); });

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape')     closeLightbox();
});
