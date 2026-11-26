(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    themeIcon.textContent = isLight ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]').content = isLight ? '#f7f7fc' : '#090a13';
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  // Progressive enhancement: IntersectionObserver fallback works without GSAP.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  // GSAP scroll reveals and timeline progression, if CDN library is available.
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    revealEls.forEach(el => {
      gsap.fromTo(el, { y: 26, opacity: 0 }, {
        y: 0, opacity: 1, duration: .75, delay: Number(el.dataset.delay || 0) / 1000,
        ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onStart: () => el.classList.add('is-visible')
      });
    });
    gsap.to('#timelineProgress', { height: '100%', ease: 'none', scrollTrigger: {
      trigger: '.timeline', start: 'top 75%', end: 'bottom 65%', scrub: true
    }});
  }
  if (window.gsap && window.ScrollTrigger) initGSAP();
  else window.addEventListener('load', initGSAP, { once: true });

  // Pointer-based 3D photo and project-card tilt; touch-friendly and reduced-motion safe.
  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    const photo = document.getElementById('photoCard');
    const tilt = (el, max = 7) => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    };
    if (photo) tilt(photo, 9);
    document.querySelectorAll('[data-tilt]').forEach(card => tilt(card, 5));
  }

  // Three.js ambient particles. If WebGL/CDN is unavailable, the CSS ambient glow remains.
  function initScene() {
    const canvas = document.getElementById('scene');
    if (!window.THREE || reducedMotion) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch (_) { return; }
    const mobile = window.innerWidth < 720;
    const count = mobile ? 380 : 850;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 100);
    camera.position.z = 12;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 24;
      positions[i * 3 + 1] = (Math.random() - .5) * 15;
      positions[i * 3 + 2] = (Math.random() - .5) * 12;
      sizes[i] = Math.random() * 1.5 + .3;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xa99aff, size: mobile ? .035 : .045, transparent: true, opacity: .7, sizeAttenuation: true });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    const resize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    window.addEventListener('pointermove', e => {
      targetX = (e.clientX / window.innerWidth - .5) * .7;
      targetY = (e.clientY / window.innerHeight - .5) * .45;
    }, { passive: true });
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      pointerX += (targetX - pointerX) * .025;
      pointerY += (targetY - pointerY) * .025;
      particles.rotation.y += .00035;
      particles.rotation.x = pointerY * .15;
      particles.position.x = pointerX;
      particles.position.y = -pointerY;
      renderer.render(scene, camera);
    };
    animate();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else animate();
    });
  }
  if (window.THREE) initScene();
  else window.addEventListener('load', initScene, { once: true });
})();