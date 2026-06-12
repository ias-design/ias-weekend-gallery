// IAS Weekends Gallery - v2
const galleries = {
  austria2024:    { folder: 'photos/austria2024',    count: 42, fullFolder: 'photos/austria2024/full' },
  portugal2025:   { folder: 'photos/portugal2025',   count: 62, fullFolder: 'photos/portugal2025/full' },
  switzerland2025:{ folder: 'photos/switzerland2025',count: 66, fullFolder: 'photos/switzerland2025/full' },
  greece2026:     { folder: 'photos/greece2026',     count: 257, fullFolder: 'photos/greece2026/full' }
};

const PASSWORD = 'ias-weekends';

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
var lbDownload = document.getElementById('lb-download');

/* ---- Password ---- */
function checkPassword() {
  if (pwInput.value.trim() === PASSWORD) {
    pwScreen.style.display = 'none';
    mainSite.style.display = 'block';
  } else {
    pwError.style.display = 'block';
    pwInput.value = '';
    pwInput.focus();
  }
}
pwBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPassword(); });

/* ---- Dropdown ---- */
dropToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  dropMenu.classList.toggle('open');
});
document.addEventListener('click', function() { dropMenu.classList.remove('open'); });

dropMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var id = link.dataset.gallery;
    showGallery(id);
    dropMenu.classList.remove('open');
    dropMenu.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
    link.classList.add('active');
    dropToggle.textContent = link.textContent + ' \u25be';
  });
});

/* ---- Show Gallery ---- */
function showGallery(id) {
  var cfg = galleries[id];
  if (!cfg) return;

  document.querySelectorAll('.gallery-section').forEach(function(s) { s.style.display = 'none'; });

  var section = document.getElementById(id);
  var grid    = document.getElementById('grid-' + id);
  if (!section || !grid) return;

  section.style.display = 'block';

  if (grid.dataset.loaded === '1') return;
  grid.dataset.loaded = '1';

  lightboxPhotos = [];

  for (var i = 1; i <= cfg.count; i++) {
    var num    = String(i).padStart(3, '0');
    var imgSrc = cfg.folder + '/' + num + '.jpg';
    var dlHref = (cfg.fullFolder ? cfg.fullFolder : cfg.folder) + '/' + num + '.jpg';

    lightboxPhotos.push({ src: imgSrc, dl: dlHref, name: num + '.jpg' });

    var wrapper = document.createElement('div');
    wrapper.className = 'photo-wrapper';
    wrapper.dataset.idx = String(i - 1);

    var img = document.createElement('img');
    img.src     = imgSrc;
    img.loading = 'lazy';
    img.alt     = 'Photo ' + num;

    var dlBtn = document.createElement('a');
    dlBtn.className   = 'download-btn';
    dlBtn.href        = dlHref;
    dlBtn.download    = num + '.jpg';
    dlBtn.textContent = '\u2193';

    wrapper.addEventListener('click', function(e) {
      if (e.target.classList.contains('download-btn')) return;
      openLightbox(parseInt(this.dataset.idx, 10));
    });

    wrapper.appendChild(img);
    wrapper.appendChild(dlBtn);
    grid.appendChild(wrapper);
  }
}

/* ---- Lightbox ---- */
function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  var photo = lightboxPhotos[lightboxIndex];
  if (!photo) return;
  lbImg.src           = photo.src;
  lbDownload.href     = photo.dl;
  lbDownload.download = photo.name;
}

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', closeLightbox);

lbPrev.addEventListener('click', function() {
  lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
  updateLightbox();
});
lbNext.addEventListener('click', function() {
  lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
  updateLightbox();
});

document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length; updateLightbox(); }
  if (e.key === 'Escape')     { closeLightbox(); }
});
