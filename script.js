// IAS Weekends Gallery
const galleries = {
  austria2024:    { folder: 'photos/austria2024',    count: 0 },
  portugal2025:   { folder: 'photos/portugal2025',   count: 0 },
  switzerland2025:{ folder: 'photos/switzerland2025',count: 65 },
  greece2026:     { folder: 'photos/greece2026',     count: 0 }
};

const PASSWORD = 'ias-weekends';

var currentGallery = 'switzerland2025';
var lightboxPhotos = [];
var lightboxIndex = 0;

var pwScreen   = document.getElementById('password-screen');
var mainSite   = document.getElementById('main-site');
var pwInput    = document.getElementById('pw-input');
var pwBtn      = document.getElementById('pw-btn');
var pwError    = document.getElementById('pw-error');
var dropToggle = document.querySelector('.dropdown-toggle');
var dropMenu   = document.querySelector('.dropdown-menu');
var lightbox   = document.getElementById('lightbox');
var lbOverlay  = document.getElementById('lb-overlay');
var lbImg      = document.getElementById('lb-img');
var lbClose    = document.getElementById('lb-close');
var lbPrev     = document.getElementById('lb-prev');
var lbNext     = document.getElementById('lb-next');

function checkPassword() {
  if (pwInput.value.trim() === PASSWORD) {
    pwScreen.style.display = 'none';
    mainSite.style.display = 'block';
    showGallery('switzerland2025');
  } else {
    pwError.style.display = 'block';
    pwInput.value = '';
    pwInput.focus();
  }
}

pwBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPassword(); });

dropToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  dropMenu.classList.toggle('open');
});

document.addEventListener('click', function() { dropMenu.classList.remove('open'); });

dropMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var galleryId = link.dataset.gallery;
    showGallery(galleryId);
    dropMenu.classList.remove('open');
    dropMenu.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
    link.classList.add('active');
    dropToggle.textContent = link.textContent + ' ▾';
  });
});

function showGallery(id) {
  currentGallery = id;
  document.querySelectorAll('.gallery-section').forEach(function(s) { s.classList.remove('active'); });
  var section = document.getElementById(id);
  if (section) section.classList.add('active');
  buildGrid(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildGrid(id) {
  var grid = document.getElementById('grid-' + id);
  if (!grid) return;
  if (grid.dataset.built === 'true') return;

  var data = galleries[id];
  var folder = data.folder;
  var count = data.count;

  if (count === 0) {
    grid.innerHTML = '<p style="color:#aaa; font-size:0.85rem; letter-spacing:0.06em; padding: 20px 0;">Photos coming soon.</p>';
    grid.dataset.built = 'true';
    return;
  }

  var fragment = document.createDocumentFragment();

  for (var i = 1; i <= count; i++) {
    var num = String(i).padStart(3, '0');
    var src = folder + '/' + num + '.jpg';

    var item = document.createElement('div');
    item.className = 'photo-item';
    item.dataset.index = i - 1;

    var img = document.createElement('img');
    img.src = src;
    img.alt = 'Photo ' + i;
    img.loading = 'lazy';

    var dlBtn = document.createElement('a');
    dlBtn.className = 'dl-btn';
    dlBtn.href = src;
    dlBtn.download = num + '.jpg';
    dlBtn.title = 'Download photo';
    dlBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    dlBtn.addEventListener('click', function(e) { e.stopPropagation(); });

    item.appendChild(img);
    item.appendChild(dlBtn);
    (function(idx) {
      item.addEventListener('click', function() { openLightbox(idx); });
    })(i - 1);
    fragment.appendChild(item);
  }

  grid.appendChild(fragment);
  grid.dataset.built = 'true';
}

function openLightbox(index) {
  var data = galleries[currentGallery];
  lightboxPhotos = [];
  for (var i = 1; i <= data.count; i++) {
    lightboxPhotos.push(data.folder + '/' + String(i).padStart(3, '0') + '.jpg');
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
lbPrev.addEventListener('click', function(e) { e.stopPropagation(); lightboxNav(-1); });
lbNext.addEventListener('click', function(e) { e.stopPropagation(); lightboxNav(1); });

document.addEventListener('keydown', function(e) {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape')     closeLightbox();
});
