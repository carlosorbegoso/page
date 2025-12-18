/**
 * Visitor Counter API Service
 * Uses CountAPI.xyz - Free, no auth required
 */

const NAMESPACE = 'carlosorbegoso-portfolio';
const KEY = 'visits';

/**
 * Get and increment visitor count
 */
export async function getVisitorCount() {
    try {
        const response = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`);

        if (response.ok) {
            const data = await response.json();
            return data.value;
        }
    } catch (error) {
        // CountAPI unavailable - silent fail
    }

    return null;
}

/**
 * Get current count without incrementing
 */
export async function getCurrentCount() {
    try {
        const response = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`);

        if (response.ok) {
            const data = await response.json();
            return data.value;
        }
    } catch (error) {
        // CountAPI unavailable - silent fail
    }

    return null;
}
