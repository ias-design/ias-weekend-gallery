// IAS Weekends Gallery
const galleries = {
        austria2024:    { folder: 'photos/austria2024',    count: 42 },
        portugal2025:   { folder: 'photos/portugal2025',   count: 62 },
        switzerland2025:{ folder: 'photos/switzerland2025',count: 66 },
        greece2026:     { folder: 'photos/greece2026',     count: 257 }
};

const CDN = 'https://cdn.statically.io/gh/ias-design/ias-weekend-gallery/main/';
const PASSWORD = 'ias-weekends';

var currentGallery = null;
var lightboxPhotos = [];
var lightboxIndex = 0;

var pwScreen = document.getElementById('password-screen');
var mainSite = document.getElementById('main-site');
var pwInput = document.getElementById('pw-input');
var pwBtn = document.getElementById('pw-btn');
var pwError = document.getElementById('pw-error');
var dropToggle = document.querySelector('.dropdown-toggle');
var dropMenu = document.querySelector('.dropdown-menu');
var lightbox = document.getElementById('lightbox');
var lbOverlay = document.getElementById('lb-overlay');
var lbImg = document.getElementById('lb-img');
var lbClose = document.getElementById('lb-close');
var lbPrev = document.getElementById('lb-prev');
var lbNext = document.getElementById('lb-next');

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
                  dropToggle.textContent = link.textContent + ' \u25be';
        });
});

function pad(n) { return String(n).padStart(3, '0'); }

function showGallery(id) {
        currentGallery = id;
        var g = galleries[id];
        var grid = document.getElementById('photo-grid');
        var title = document.getElementById('gallery-title');
        title.textContent = dropMenu.querySelector('[data-gallery="' + id + '"]').textContent;
        grid.innerHTML = '';

  if (!g || g.count === 0) {
            grid.innerHTML = '<p style="color:#999;font-size:0.85rem;letter-spacing:0.05em;">Photos coming soon.</p>';
            return;
  }

  lightboxPhotos = [];

  for (var i = 1; i <= g.count; i++) {
            var filename = pad(i) + '.jpg';
            var fullUrl = g.folder + '/' + filename;
            var thumbUrl = CDN + g.folder + '/' + filename + '?w=600&q=80';

          lightboxPhotos.push(fullUrl);

          (function(full, thumb, idx) {
                      var item = document.createElement('div');
                      item.className = 'photo-item';

                 var img = document.createElement('img');
                      img.src = thumb;
                      img.alt = 'Photo ' + (idx + 1);
                      img.loading = 'lazy';

                 var dlBtn = document.createElement('a');
                      dlBtn.className = 'download-btn';
                      dlBtn.href = full;
                      dlBtn.download = '';
                      dlBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
                      dlBtn.addEventListener('click', function(e) { e.stopPropagation(); });

                 item.appendChild(img);
                      item.appendChild(dlBtn);
                      item.addEventListener('click', function() { openLightbox(idx); });
                      grid.appendChild(item);
          })(fullUrl, thumbUrl, i - 1);
  }
}

function openLightbox(idx) {
        lightboxIndex = idx;
        lbImg.src = lightboxPhotos[idx];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
}

function closeLightbox() {
        lightbox.style.display = 'none';
        lbImg.src = '';
        document.body.style.overflow = '';
}

function prevPhoto() {
        lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
        lbImg.src = lightboxPhotos[lightboxIndex];
}

function nextPhoto() {
        lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
        lbImg.src = lightboxPhotos[lightboxIndex];
}

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prevPhoto(); });
lbNext.addEventListener('click', function(e) { e.stopPropagation(); nextPhoto(); });

document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
                  if (e.key === 'ArrowLeft') prevPhoto();
                  if (e.key === 'ArrowRight') nextPhoto();
                  if (e.key === 'Escape') closeLightbox();
        }
});
