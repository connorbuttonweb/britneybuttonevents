document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gallery-container');
  if (!container) {
    console.error('No #gallery-container found on this page.');
    return;
  }

  const loadGallery = async () => {
    try {
      const res = await fetch('gallery_data.json');

      if (!res.ok) {
        console.error('Failed to load gallery_data.json', res.status, res.statusText);
        return;
      }

      const images = await res.json();
      if (!Array.isArray(images) || images.length === 0) {
        console.warn('gallery_data.json is empty or not an array.');
        return;
      }

      // Create DOM nodes
      images.forEach((data, index) => {   // <— add index param
        if (!data || !data.low || !data.full) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = data.low;
        img.dataset.full = data.full;
        img.dataset.index = index;        // <— add this line
        img.loading = 'lazy';
        img.className = 'progressive-img';
        img.alt = 'Gallery image';

        wrapper.appendChild(img);
        container.appendChild(wrapper);
      });

      // Progressive upgrade to high-res when in view
      const onIntersect = (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          const fullSrc = img.dataset.full;
          if (!fullSrc) return;

          const hi = new Image();
          hi.src = fullSrc;
          hi.onload = () => {
            img.src = fullSrc;
            img.classList.add('loaded');
          };
          observer.unobserve(img);
        });
      };

      const observer = new IntersectionObserver(onIntersect, {
        rootMargin: '100px',
        threshold: 0.1
      });

      document.querySelectorAll('.progressive-img').forEach(img => {
        observer.observe(img);
      });

      // ----- LIGHTBOX LOGIC -----
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-lightbox');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        let currentIndex = 0;

        const openLightbox = index => {
          currentIndex = index;
          const data = images[currentIndex];
          if (!data) return;
          lightboxImg.src = data.full;
          lightbox.style.display = 'flex'; // matches CSS .lightbox flex settings
        };

        const closeLightbox = () => {
          lightbox.style.display = 'none';
          lightboxImg.src = '';
        };

        const showNext = () => {
          currentIndex = (currentIndex + 1) % images.length;
          openLightbox(currentIndex);
        };

        const showPrev = () => {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          openLightbox(currentIndex);
        };

        // click on thumbnails
        container.addEventListener('click', e => {
          const img = e.target.closest('img.progressive-img');
          if (!img) return;
          const index = parseInt(img.dataset.index, 10);
          if (Number.isNaN(index)) return;
          openLightbox(index);
        });

        // controls
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        // close when clicking outside image
        lightbox.addEventListener('click', e => {
          if (e.target === lightbox) closeLightbox();
        });

        // Esc to close, arrows to navigate
        document.addEventListener('keydown', e => {
          if (lightbox.style.display !== 'flex') return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowRight') showNext();
          if (e.key === 'ArrowLeft') showPrev();
        });

        // --- Swipe Support for Mobile ---
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance in pixels to count as a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                showNext(); // Swiped left -> Next photo
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                showPrev(); // Swiped right -> Previous photo
            }
        }
        // ----- END LIGHTBOX LOGIC ----- 

    } catch (err) {
      console.error('Error loading gallery:', err);
    }
  };

  loadGallery();
});

