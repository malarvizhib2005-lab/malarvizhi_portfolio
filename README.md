# Malarvizhi B — Portfolio

A responsive one-page developer portfolio built with HTML, CSS and JavaScript. It uses Three.js for the ambient particle background and GSAP + ScrollTrigger for scroll animation (both loaded from CDN), with graceful static fallbacks.

## Setup

1. Unzip the folder.
2. Add your resume PDF as `assets/resume.pdf` (the portfolio download button points to this file).
3. Open `index.html` in a browser, or deploy the entire folder to GitHub Pages / Netlify.

## Deploy

- **GitHub Pages:** Push the folder contents to a repository, then choose **Settings → Pages** and deploy from your main branch.
- **Netlify:** Drag the portfolio folder into Netlify Drop, or connect the repository.

## Notes

- The portrait is included at `assets/profile.jpg`; it is used as-is and not modified.
- Resume facts and project descriptions are based on the supplied resume.
- The email, phone, LinkedIn, GitHub and project links are taken from the resume.
- The resume PDF itself is not embedded in this package; add it as `assets/resume.pdf`.
- Theme toggle, mobile navigation, keyboard focus, reduced-motion handling, and WebGL fallback are included.
- External fonts and animation libraries load from CDNs; the page still displays if they are unavailable.
