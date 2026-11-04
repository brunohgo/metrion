# AI Rules

## Tech stack

- **HTML5** is the application structure: the site is a Vite multi-page static website, not a React single-page app.
- **Modern JavaScript (ES modules)** powers behavior and interactions; source modules live under `src/js/`.
- **Vite 8** is the development server and production bundler. Keep all page entry points configured in `vite.config.js`.
- **Tailwind CSS v4** is used for utility-first styling through the `@tailwindcss/vite` plugin.
- **Custom CSS** in `src/styles/main.css` provides design tokens, reusable component styles, responsive details, and effects that would be unwieldy as utilities.
- **GSAP 3** provides timeline-based animation, entrance sequences, and scroll-driven motion through `ScrollTrigger`.
- **Lenis** provides smooth scrolling and must remain synchronized with GSAP's ticker and scroll updates.
- **Vite build-time configuration** centralizes public-domain and contact values in `site.config.js` and generates SEO files from `src/seo/` templates.

## Library and implementation rules

- Use semantic HTML, native browser APIs, and small local modules for ordinary behavior. Do not introduce a framework, router, component library, or state-management package for this static multi-page site.
- Use Tailwind classes for simple layout, spacing, typography, color, and responsive styling. Put repeated or complex visual patterns in `src/styles/main.css` instead of adding large inline style blocks.
- Use GSAP for coordinated animation, timelines, parallax, ScrollTrigger scenes, and motion that depends on scroll position. Register GSAP plugins in the module that owns the animation and clean up listeners/triggers when needed.
- Use Lenis only for smooth scrolling. Do not implement a second smooth-scroll system or animate scroll position with custom requestAnimationFrame logic when Lenis can handle it.
- Use native HTML elements and browser APIs for forms, dialogs, accordions, storage, and validation unless an existing requirement genuinely needs a dependency. Keep interactions keyboard-accessible and expose state with appropriate ARIA attributes.
- Use the existing asset files under `public/images/` for imagery. Do not add remote image URLs or placeholder assets when a local asset is available; include dimensions or equivalent layout constraints to reduce layout shift.
- Keep company identity and deploy-time domain values in `site.config.js` or `src/config/company.js`; do not duplicate production contact details across page files.
- Keep page-specific behavior in focused modules under `src/js/`, shared behavior in `src/js/components/`, animation code in `src/js/animations/`, and reusable input checks in `src/js/utils/`.
- Preserve the Portuguese European (`pt-PT`) language, the existing visual system, reduced-motion support, SEO metadata, and the honest demo-only behavior of forms unless the request explicitly changes them.
- Avoid adding dependencies for one-off utilities. Before adding a package, confirm that the requested behavior cannot be implemented clearly with the existing stack and browser APIs.

## Editing and quality rules

- Read the relevant page, module, and stylesheet before editing; make the smallest complete change needed.
- Do not edit generated `dist/` output. Update source files and run the Vite build when build configuration, entry points, or SEO generation changes.
- Do not claim that forms send data to a backend unless a real backend integration exists.
- Maintain WCAG-oriented keyboard navigation, visible focus states, sensible contrast, and `prefers-reduced-motion` behavior for all new interactive features.
- Keep URLs, canonical tags, structured data, sitemap generation, and `robots.txt` consistent when adding or renaming pages.
