/**
 * Lazy Loading Images Module
 * Handles deferred image loading with smooth transitions
 */

export class LazyImages {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if (typeof window === 'undefined') return;

        // Use native lazy loading with enhancement
        this.setupNativeLazy();

        // Setup IntersectionObserver for additional effects
        this.setupObserver();
    }

    /**
     * Setup native lazy loading enhancement
     */
    setupNativeLazy() {
        // Add loaded class when images finish loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.add('loaded', 'error');
                    // Optional: set fallback image
                    // img.src = '/images/placeholder.svg';
                });
            }
        });
    }

    /**
     * Setup IntersectionObserver for custom lazy loading
     */
    setupObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            this.loadAllImages();
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });

        // Observe background images
        document.querySelectorAll('[data-bg]').forEach(el => {
            this.observer.observe(el);
        });
    }

    /**
     * Load a single image
     * @param {HTMLElement} element - Image or element with background
     */
    loadImage(element) {
        if (element.tagName === 'IMG') {
            const src = element.dataset.src;
            const srcset = element.dataset.srcset;

            if (srcset) {
                element.srcset = srcset;
            }
            if (src) {
                element.src = src;
            }

            element.removeAttribute('data-src');
            element.removeAttribute('data-srcset');

            element.addEventListener('load', () => {
                element.classList.add('loaded');
            });
        } else {
            // Background image
            const bg = element.dataset.bg;
            if (bg) {
                element.style.backgroundImage = `url(${bg})`;
                element.removeAttribute('data-bg');
                element.classList.add('loaded');
            }
        }
    }

    /**
     * Load all images (fallback for older browsers)
     */
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
        document.querySelectorAll('[data-bg]').forEach(el => {
            this.loadImage(el);
        });
    }

    /**
     * Manually observe new images (for dynamically added content)
     * @param {HTMLElement|string} container - Container with new images
     */
    observeNew(container) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el || !this.observer) return;

        el.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });

        el.querySelectorAll('[data-bg]').forEach(bg => {
            this.observer.observe(bg);
        });
    }

    /**
     * Create responsive srcset string
     * @param {string} basePath - Base image path without extension
     * @param {string} extension - Image extension (default: 'jpg')
     * @param {number[]} widths - Array of widths to generate
     * @returns {string} srcset string
     */
    static generateSrcset(basePath, extension = 'jpg', widths = [300, 600, 900, 1200]) {
        return widths.map(w => `${basePath}-${w}w.${extension} ${w}w`).join(', ');
    }

    /**
     * Preload critical images
     * @param {string[]} urls - Array of image URLs to preload
     */
    static preload(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    /**
     * Cleanup observer
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}

// Auto-initialize
let lazyImages;
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            lazyImages = new LazyImages();
        });
    } else {
        lazyImages = new LazyImages();
    }
}

export { lazyImages };
export default LazyImages;
