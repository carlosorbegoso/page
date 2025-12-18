/**
 * Centralized Profile Data Service
 * Single source of truth for profile information
 * Combines static personal data with dynamic GitHub data
 */

import { getGitHubStats } from './github-api.js';

// Base URL for assets (handles both dev and production with base path)
const BASE_URL = import.meta.env?.BASE_URL || '/page/';

// Static profile data (things that don't come from APIs)
const staticProfile = {
    name: 'Carlos Orbegoso',
    role: 'Backend Developer',
    specialization: 'Java Specialist',
    email: 'contact@carlosorbegoso.com', // Update with your real email
    location: 'Peru',
    available: true,
    socialLinks: {
        github: 'https://github.com/carlosorbegoso',
        linkedin: 'https://linkedin.com/in/carlosorbegoso', // Update with your real LinkedIn
        twitter: '', // Add if you have one
    },
    // Core technologies (shown in Hero/About)
    coreTech: ['Java', 'Spring Boot', 'Quarkus', 'Angular', 'Docker', 'Kubernetes'],
    // Short bio for Hero section
    tagline: 'I develop robust and scalable enterprise applications with the best technologies in the market.'
};

// Cache for combined profile data
let cachedProfile = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get complete profile data (static + GitHub)
 */
export async function getProfileData() {
    // Check cache
    if (cachedProfile && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedProfile;
    }

    try {
        const githubData = await getGitHubStats();

        if (githubData) {
            cachedProfile = {
                ...staticProfile,
                // Override/enhance with GitHub data
                name: githubData.profile.name || staticProfile.name,
                bio: githubData.profile.bio || staticProfile.tagline,
                location: githubData.profile.location || staticProfile.location,
                avatar: githubData.profile.avatar,
                github: {
                    username: githubData.profile.login,
                    url: `https://github.com/${githubData.profile.login}`,
                    yearsOnGitHub: githubData.profile.yearsOnGitHub,
                    stats: {
                        repos: githubData.stats.totalRepos,
                        stars: githubData.stats.totalStars,
                        forks: githubData.stats.totalForks,
                        followers: githubData.stats.followers,
                        contributions: githubData.stats.contributions,
                        streak: githubData.stats.currentStreak
                    },
                    topLanguages: githubData.languages,
                    featuredRepos: githubData.featuredRepos,
                    activity: githubData.activity,
                    contributionData: githubData.contributionData
                }
            };
        } else {
            // Fallback to static data only
            cachedProfile = {
                ...staticProfile,
                avatar: `${BASE_URL}/images/profile.jpeg`,
                github: null
            };
        }

        cacheTimestamp = Date.now();
        return cachedProfile;

    } catch (error) {
        console.error('Error fetching profile data:', error);
        // Return static data on error
        return {
            ...staticProfile,
            avatar: `${BASE_URL}/images/profile.jpeg`,
            github: null
        };
    }
}

/**
 * Get static profile data only (no API calls)
 */
export function getStaticProfile() {
    return staticProfile;
}

/**
 * Calculate years of experience based on GitHub account age
 * You can adjust this formula based on when you started coding professionally
 */
export function calculateYearsExperience(yearsOnGitHub) {
    // Assuming you started professional work around the same time as GitHub
    // Adjust this if needed
    return Math.max(yearsOnGitHub || 0, 5); // Minimum 5 years as fallback
}
