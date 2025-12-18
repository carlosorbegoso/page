/**
 * Skeleton Loading Component Generator
 * Creates shimmer loading placeholders for dynamic content
 */

export class SkeletonLoader {
    /**
     * Create a skeleton card element
     * @param {Object} options - Configuration options
     * @returns {HTMLElement}
     */
    static createCard(options = {}) {
        const {
            hasAvatar = false,
            lines = 3,
            className = ''
        } = options;

        const card = document.createElement('div');
        card.className = `skeleton-card ${className}`.trim();

        if (hasAvatar) {
            const avatar = document.createElement('div');
            avatar.className = 'skeleton skeleton-avatar';
            card.appendChild(avatar);
        }

        const title = document.createElement('div');
        title.className = 'skeleton skeleton-title';
        card.appendChild(title);

        for (let i = 0; i < lines; i++) {
            const text = document.createElement('div');
            const widthClass = i === lines - 1 ? 'short' : i === lines - 2 ? 'medium' : '';
            text.className = `skeleton skeleton-text ${widthClass}`.trim();
            card.appendChild(text);
        }

        return card;
    }

    /**
     * Create a skeleton stat element (for GitHub stats)
     * @returns {HTMLElement}
     */
    static createStat() {
        const stat = document.createElement('div');
        stat.className = 'skeleton-stat';

        const value = document.createElement('div');
        value.className = 'skeleton skeleton-stat-value';

        const label = document.createElement('div');
        label.className = 'skeleton skeleton-stat-label';

        stat.appendChild(value);
        stat.appendChild(label);

        return stat;
    }

    /**
     * Create multiple skeleton stats in a row
     * @param {number} count - Number of stats
     * @returns {HTMLElement}
     */
    static createStatsRow(count = 4) {
        const container = document.createElement('div');
        container.className = 'skeleton-stats-row';
        container.style.cssText = 'display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;';

        for (let i = 0; i < count; i++) {
            container.appendChild(this.createStat());
        }

        return container;
    }

    /**
     * Create a skeleton project card
     * @returns {HTMLElement}
     */
    static createProjectCard() {
        const card = document.createElement('div');
        card.className = 'skeleton-card';
        card.style.cssText = 'min-height: 200px;';

        // Image placeholder
        const img = document.createElement('div');
        img.className = 'skeleton';
        img.style.cssText = 'height: 120px; border-radius: 8px; margin-bottom: 1rem;';
        card.appendChild(img);

        // Title
        const title = document.createElement('div');
        title.className = 'skeleton skeleton-title';
        card.appendChild(title);

        // Description lines
        for (let i = 0; i < 2; i++) {
            const text = document.createElement('div');
            text.className = `skeleton skeleton-text ${i === 1 ? 'medium' : ''}`;
            card.appendChild(text);
        }

        // Tags
        const tags = document.createElement('div');
        tags.style.cssText = 'display: flex; gap: 0.5rem; margin-top: 0.5rem;';
        for (let i = 0; i < 3; i++) {
            const tag = document.createElement('div');
            tag.className = 'skeleton';
            tag.style.cssText = 'width: 60px; height: 24px; border-radius: 12px;';
            tags.appendChild(tag);
        }
        card.appendChild(tags);

        return card;
    }

    /**
     * Show skeleton in a container
     * @param {HTMLElement|string} container - Container element or selector
     * @param {string} type - 'card' | 'stat' | 'stats-row' | 'project'
     * @param {Object} options - Additional options
     */
    static show(container, type = 'card', options = {}) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return null;

        let skeleton;
        switch (type) {
            case 'stat':
                skeleton = this.createStat();
                break;
            case 'stats-row':
                skeleton = this.createStatsRow(options.count || 4);
                break;
            case 'project':
                skeleton = this.createProjectCard();
                break;
            default:
                skeleton = this.createCard(options);
        }

        skeleton.setAttribute('data-skeleton', 'true');
        el.appendChild(skeleton);
        return skeleton;
    }

    /**
     * Remove all skeletons from a container
     * @param {HTMLElement|string} container - Container element or selector
     */
    static hide(container) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        const skeletons = el.querySelectorAll('[data-skeleton]');
        skeletons.forEach(s => {
            s.style.animation = 'none';
            s.style.opacity = '0';
            s.style.transition = 'opacity 0.3s ease';
            setTimeout(() => s.remove(), 300);
        });
    }

    /**
     * Replace skeleton with actual content
     * @param {HTMLElement|string} container - Container element or selector
     * @param {HTMLElement|string} content - Content to show
     */
    static replaceWith(container, content) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        // Fade out skeletons
        this.hide(el);

        // Add content after skeleton fades
        setTimeout(() => {
            if (typeof content === 'string') {
                el.innerHTML = content;
            } else {
                el.appendChild(content);
            }
            // Fade in content
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
                el.style.opacity = '1';
            });
        }, 300);
    }
}

export default SkeletonLoader;
