document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('gallery-container');
  console.log('Gallery container:', container);
  if (!container) return;

  try {
    const res = await fetch('gallery_data.json');
    console.log('JSON response status:', res.status);
    if (!res.ok) {
      console.error('Failed to load gallery_data.json', res.status, res.statusText);
      return;
    }

    const images = await res.json();
    console.log('Loaded images:', images.length);

    images.forEach(data => {
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = data.low;
      img.dataset.full = data.full;
      img.loading = 'lazy';
      img.className = 'progressive-img';
      img.alt = 'Gallery image';

      wrapper.appendChild(img);
      container.appendChild(wrapper);
    });

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
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
});
