// IAS Weekends Gallery - v2
const galleries = {
              austria2024:    { folder: 'photos/austria2024',    count: 42  },
              portugal2025:   { folder: 'photos/portugal2025',   count: 62  },
              switzerland2025:{ folder: 'photos/switzerland2025', count: 66  },
              greece2026:     { folder: 'photos/greece2026',     count: 257 }
};

const PASSWORD = 'ias-weekends';

var lightboxPhotos = [];
var lightboxIndex  = 0;

var pwScreen    = document.getElementById('password-screen');
var mainSite    = document.getElementById('main-site');
var pwInput     = document.getElementById('pw-input');
var pwBtn       = document.getElementById('pw-btn');
var pwError     = document.getElementById('pw-error');
var dropToggle  = document.querySelector('.dropdown-toggle');
var dropMenu    = document.querySelector('.dropdown-menu');
var lightbox    = document.getElementById('lightbox');
var lbOverlay   = document.getElementById('lb-overlay');
var lbImg       = document.getElementById('lb-img');
var lbClose     = document.getElementById('lb-close');
var lbPrev      = document.getElementById('lb-prev');
var lbNext      = document.getElementById('lb-next');
var lbDownload  = document.getElementById('lb-download');

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

/* ---- Gallery ---- */
function showGallery(key) {
              Object.keys(galleries).forEach(function(k) {
                              var sec = document.getElementById(k);
                              if (sec) sec.style.display = (k === key) ? 'block' : 'none';
              });

  var g = galleries[key];
              if (!g) return;

  var grid = document.getElementById('grid-' + key);
              if (!grid) return;

  if (grid.dataset.built === '1') {
                  lightboxPhotos = [];
                  grid.querySelectorAll('img').forEach(function(img) { lightboxPhotos.push(img.src); });
                  return;
  }

  grid.innerHTML = '';
              lightboxPhotos = [];

  for (var i = 1; i <= g.count; i++) {
                  var filename = String(i).padStart(3, '0') + '.jpg';
                  var url      = g.folder + '/' + filename;

                var wrapper = document.createElement('div');
                  wrapper.className = 'photo-wrapper';

                var img = document.createElement('img');
                  img.src    = url;
                  img.alt    = 'Photo ' + i;
                  img.loading = 'lazy';

                var dlBtn = document.createElement('a');
                  dlBtn.className = 'download-btn';
                  dlBtn.innerHTML = '\u2193';
                  dlBtn.title     = 'Download photo';
                  dlBtn.href      = url;
                  dlBtn.setAttribute('download', filename);
                  dlBtn.addEventListener('click', function(e) { e.stopPropagation(); });

                wrapper.appendChild(img);
                  wrapper.appendChild(dlBtn);
                  grid.appendChild(wrapper);

                lightboxPhotos.push(url);

                (function(idx) {
                                  wrapper.addEventListener('click', function(e) {
                                                      if (e.target === dlBtn || dlBtn.contains(e.target)) return;
                                                      openLightbox(idx);
                                  });
                })(lightboxPhotos.length - 1);
  }

  grid.dataset.built = '1';
}

/* ---- Lightbox ---- */
function openLightbox(index) {
              lightboxIndex  = index;
              lbImg.src      = lightboxPhotos[lightboxIndex];
              if (lbDownload) {
                              lbDownload.href = lightboxPhotos[lightboxIndex];
                              lbDownload.setAttribute('download', 'photo-' + (lightboxIndex + 1) + '.jpg');
              }
              lightbox.classList.add('active');
              document.body.style.overflow = 'hidden';
}

function closeLightbox() {
              lightbox.classList.remove('active');
              lbImg.src = '';
              document.body.style.overflow = '';
}

function prevPhoto() {
              lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
              lbImg.src = lightboxPhotos[lightboxIndex];
              if (lbDownload) {
                              lbDownload.href = lightboxPhotos[lightboxIndex];
                              lbDownload.setAttribute('download', 'photo-' + (lightboxIndex + 1) + '.jpg');
              }
}

function nextPhoto() {
              lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
              lbImg.src = lightboxPhotos[lightboxIndex];
              if (lbDownload) {
                              lbDownload.href = lightboxPhotos[lightboxIndex];
                              lbDownload.setAttribute('download', 'photo-' + (lightboxIndex + 1) + '.jpg');
              }
}

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prevPhoto(); });
lbNext.addEventListener('click', function(e) { e.stopPropagation(); nextPhoto(); });
if (lbDownload) { lbDownload.addEventListener('click', function(e) { e.stopPropagation(); }); }

document.addEventListener('keydown', function(e) {
              if (lightbox.classList.contains('active')) {
                              if (e.key === 'ArrowLeft')  prevPhoto();
                              if (e.key === 'ArrowRight') nextPhoto();
                              if (e.key === 'Escape')     closeLightbox();
              }
});
