/**
 * Scroll-triggered Animations Module
 * Handles timeline progress, staggered reveals, and scroll-based effects
 */

export class ScrollAnimations {
    constructor() {
        this.observers = new Map();
        this.scrollHandlers = [];
        this.init();
    }

    init() {
        if (typeof window === 'undefined') return;

        // Setup scroll listener with throttling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initialize components
        this.setupTimelineProgress();
        this.setupStaggeredReveal();
        this.setupParallax();
    }

    onScroll() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        this.scrollHandlers.forEach(handler => handler(scrollY, viewportHeight));
    }

    /**
     * Setup timeline progress bar that fills as you scroll
     */
    setupTimelineProgress() {
        const timeline = document.querySelector('.experience-timeline, .timeline');
        if (!timeline) return;

        // Create progress track if it doesn't exist
        let track = timeline.querySelector('.timeline-progress-track');
        if (!track) {
            track = document.createElement('div');
            track.className = 'timeline-progress-track';
            track.innerHTML = '<div class="timeline-progress-bar"></div>';
            timeline.style.position = 'relative';
            timeline.prepend(track);
        }

        const progressBar = track.querySelector('.timeline-progress-bar');
        const items = timeline.querySelectorAll('.experience-card, .timeline-item');

        this.scrollHandlers.push((scrollY, viewportHeight) => {
            const rect = timeline.getBoundingClientRect();
            const timelineTop = rect.top + scrollY;
            const timelineHeight = rect.height;

            // Calculate how far we've scrolled through the timeline
            const scrollStart = timelineTop - viewportHeight * 0.7;
            const scrollEnd = timelineTop + timelineHeight - viewportHeight * 0.3;
            const scrollRange = scrollEnd - scrollStart;

            let progress = (scrollY - scrollStart) / scrollRange;
            progress = Math.max(0, Math.min(1, progress));

            progressBar.style.height = `${progress * 100}%`;

            // Animate checkmarks as they come into view
            items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemProgress = (viewportHeight - itemRect.top) / viewportHeight;

                if (itemProgress > 0.3) {
                    const check = item.querySelector('.timeline-check');
                    if (check && !check.classList.contains('completed')) {
                        setTimeout(() => {
                            check.classList.add('completed');
                        }, index * 100);
                    }
                }
            });
        });
    }

    /**
     * Setup staggered reveal animations for groups of elements
     */
    setupStaggeredReveal() {
        const staggerGroups = document.querySelectorAll('[data-stagger-group]');

        staggerGroups.forEach(group => {
            const children = group.querySelectorAll('[data-stagger-item]');
            const delay = parseInt(group.dataset.staggerDelay) || 100;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('stagger-visible');
                            }, index * delay);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            observer.observe(group);
            this.observers.set(group, observer);
        });
    }

    /**
     * Setup parallax effects for background elements
     */
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;

            this.scrollHandlers.push((scrollY) => {
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) * speed * 0.1;

                el.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    /**
     * Add custom scroll handler
     * @param {Function} handler - Function receiving (scrollY, viewportHeight)
     */
    addScrollHandler(handler) {
        this.scrollHandlers.push(handler);
    }

    /**
     * Create a reveal-on-scroll observer
     * @param {string} selector - Elements to observe
     * @param {Object} options - IntersectionObserver options
     */
    observeReveal(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        const {
            threshold = 0.2,
            rootMargin = '0px 0px -50px 0px',
            className = 'scroll-visible',
            once = true
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    if (once) observer.unobserve(entry.target);
                } else if (!once) {
                    entry.target.classList.remove(className);
                }
            });
        }, { threshold, rootMargin });

        elements.forEach(el => observer.observe(el));
        return observer;
    }

    /**
     * Cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.scrollHandlers = [];
    }
}

// Auto-initialize
let scrollAnimations;
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            scrollAnimations = new ScrollAnimations();
        });
    } else {
        scrollAnimations = new ScrollAnimations();
    }
}

export { scrollAnimations };
export default ScrollAnimations;
