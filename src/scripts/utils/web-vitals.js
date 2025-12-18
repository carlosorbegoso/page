/**
 * Web Vitals Performance Monitoring Module
 * Tracks Core Web Vitals: LCP, FID, CLS, INP, TTFB
 *
 * @see https://web.dev/vitals/
 */

import { onCLS, onLCP, onINP, onTTFB, onFCP } from 'web-vitals';

// Performance thresholds (Google's recommendations)
const THRESHOLDS = {
    LCP: { good: 2500, needsImprovement: 4000 },    // Largest Contentful Paint
    FCP: { good: 1800, needsImprovement: 3000 },    // First Contentful Paint
    CLS: { good: 0.1, needsImprovement: 0.25 },     // Cumulative Layout Shift
    INP: { good: 200, needsImprovement: 500 },      // Interaction to Next Paint
    TTFB: { good: 800, needsImprovement: 1800 }     // Time to First Byte
};

/**
 * Get performance rating based on metric value
 */
function getRating(name, value) {
    const threshold = THRESHOLDS[name];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
}

/**
 * Format metric value for display
 */
function formatValue(name, value) {
    if (name === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
}

/**
 * Log metric to console with styling
 */
function logMetric(metric) {
    const rating = getRating(metric.name, metric.value);
    const formattedValue = formatValue(metric.name, metric.value);

    const colors = {
        good: '#0CCE6B',
        'needs-improvement': '#FFA400',
        poor: '#FF4E42'
    };

    const descriptions = {
        LCP: 'Largest Contentful Paint - Loading performance',
        FCP: 'First Contentful Paint - Initial render',
        CLS: 'Cumulative Layout Shift - Visual stability',
        INP: 'Interaction to Next Paint - Responsiveness',
        TTFB: 'Time to First Byte - Server response'
    };

    console.log(
        `%c⚡ ${metric.name}: ${formattedValue} (${rating})`,
        `color: ${colors[rating]}; font-weight: bold;`
    );

    if (import.meta.env.DEV) {
        console.log(`   ${descriptions[metric.name]}`);
        console.log(`   ID: ${metric.id}`);
    }
}

/**
 * Send metrics to analytics endpoint (optional)
 * You can configure this to send to Google Analytics, your own backend, etc.
 */
function sendToAnalytics(metric) {
    const body = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        timestamp: Date.now()
    };

    // Option 1: Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true
        });
    }

    // Option 2: Send to custom endpoint via Beacon API
    // Uncomment and configure your endpoint:
    // const endpoint = 'https://your-analytics-endpoint.com/vitals';
    // navigator.sendBeacon(endpoint, JSON.stringify(body));

    // Option 3: Store in localStorage for debugging
    if (import.meta.env.DEV) {
        const stored = JSON.parse(localStorage.getItem('webVitals') || '[]');
        stored.push(body);
        // Keep only last 50 entries
        if (stored.length > 50) stored.shift();
        localStorage.setItem('webVitals', JSON.stringify(stored));
    }
}

/**
 * Main handler for all metrics
 */
function handleMetric(metric) {
    if (import.meta.env.DEV) {
        logMetric(metric);
    }
    sendToAnalytics(metric);
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
    // Only run in browser
    if (typeof window === 'undefined') return;

    try {
        // Track all Core Web Vitals
        onCLS(handleMetric);
        onFCP(handleMetric);
        onLCP(handleMetric);
        onINP(handleMetric);
        onTTFB(handleMetric);

        // Web Vitals initialized silently
    } catch (error) {
        console.warn('Web Vitals initialization failed:', error);
    }
}

/**
 * Get stored vitals from localStorage (dev mode)
 */
export function getStoredVitals() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('webVitals') || '[]');
}

/**
 * Clear stored vitals (dev mode)
 */
export function clearStoredVitals() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('webVitals');
    console.log('Stored Web Vitals cleared');
}

/**
 * Generate performance report
 */
export function generateReport() {
    const vitals = getStoredVitals();
    if (vitals.length === 0) {
        console.log('No Web Vitals data stored yet');
        return null;
    }

    const report = {};
    const metricNames = ['LCP', 'FCP', 'CLS', 'INP', 'TTFB'];

    metricNames.forEach(name => {
        const metrics = vitals.filter(v => v.name === name);
        if (metrics.length > 0) {
            const values = metrics.map(m => m.value);
            report[name] = {
                count: metrics.length,
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                latest: metrics[metrics.length - 1]
            };
        }
    });

    console.table(report);
    return report;
}

// Auto-initialize
initWebVitals();

export default { initWebVitals, getStoredVitals, clearStoredVitals, generateReport };
