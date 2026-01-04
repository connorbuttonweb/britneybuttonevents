document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('gallery');
    if (!container) return;

    // Load JSON
    const res = await fetch('gallery_data.json');
    const images = await res.json();   // [{ full: '...', low: '...' }, ...]

    // Build DOM elements correctly
    images.forEach(data => {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = data.low;             // low‑res first
        img.dataset.full = data.full;   // high‑res path
        img.loading = 'lazy';
        img.className = 'progressive-img';
        img.alt = 'Gallery image';

        wrapper.appendChild(img);
        container.appendChild(wrapper);
    });

    // Progressive swap: low -> full
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
});