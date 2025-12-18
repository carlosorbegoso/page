/**
 * GitHub API Service - Enhanced Version
 * Fetches public data from GitHub API without authentication
 * Rate limit: 60 requests/hour for unauthenticated requests
 */

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'carlosorbegoso';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch with cache support
 */
async function fetchWithCache(url) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        cache.set(url, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error('GitHub API fetch error:', error);
        throw error;
    }
}

/**
 * Get user profile information
 */
export async function getUserProfile() {
    const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
    return fetchWithCache(url);
}

/**
 * Get user's public repositories
 */
export async function getRepositories(options = {}) {
    const { sort = 'updated', per_page = 100 } = options;
    const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=${sort}&per_page=${per_page}`;
    return fetchWithCache(url);
}

/**
 * Get user's recent events/activity
 */
export async function getRecentActivity(per_page = 30) {
    const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=${per_page}`;
    return fetchWithCache(url);
}

/**
 * Calculate language statistics from repositories
 */
export async function getLanguageStats() {
    const repos = await getRepositories();
    const languageCount = {};

    repos.forEach(repo => {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });

    // Sort by count and return top languages
    const sorted = Object.entries(languageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

    const total = sorted.reduce((sum, [, count]) => sum + count, 0);

    return sorted.map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / total) * 100)
    }));
}

/**
 * Parse recent activity into readable format
 */
export async function getParsedActivity() {
    const events = await getRecentActivity(15);

    return events
        .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent', 'ForkEvent'].includes(event.type))
        .slice(0, 8)
        .map(event => {
            const repo = event.repo.name.replace(`${GITHUB_USERNAME}/`, '');
            const date = new Date(event.created_at);
            const timeAgo = getTimeAgo(date);

            let action = '';
            let icon = 'fas fa-code';
            let details = '';

            switch (event.type) {
                case 'PushEvent':
                    const commits = event.payload.commits?.length || 0;
                    action = `Pushed ${commits} commit${commits > 1 ? 's' : ''}`;
                    icon = 'fas fa-code-commit';
                    details = event.payload.commits?.[0]?.message?.split('\n')[0] || '';
                    break;
                case 'CreateEvent':
                    action = `Created ${event.payload.ref_type}`;
                    icon = 'fas fa-plus';
                    details = event.payload.ref || '';
                    break;
                case 'PullRequestEvent':
                    action = `${event.payload.action} PR`;
                    icon = 'fas fa-code-pull-request';
                    details = event.payload.pull_request?.title || '';
                    break;
                case 'IssuesEvent':
                    action = `${event.payload.action} issue`;
                    icon = 'fas fa-circle-dot';
                    details = event.payload.issue?.title || '';
                    break;
                case 'WatchEvent':
                    action = 'Starred';
                    icon = 'fas fa-star';
                    break;
                case 'ForkEvent':
                    action = 'Forked';
                    icon = 'fas fa-code-fork';
                    break;
            }

            return {
                type: event.type,
                action,
                repo,
                repoUrl: `https://github.com/${event.repo.name}`,
                icon,
                details: details.substring(0, 50) + (details.length > 50 ? '...' : ''),
                timeAgo,
                date
            };
        });
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

/**
 * Calculate contribution streak (approximation from events)
 */
export async function getContributionStreak() {
    const events = await getRecentActivity(100);

    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        eventsByDate[date] = (eventsByDate[date] || 0) + 1;
    });

    // Calculate current streak
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        if (eventsByDate[dateStr]) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    // Generate contribution data for visualization (last 52 weeks)
    const contributionData = [];
    for (let week = 51; week >= 0; week--) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (week * 7 + (6 - day)));
            const dateStr = date.toISOString().split('T')[0];
            const count = eventsByDate[dateStr] || 0;
            weekData.push({
                date: dateStr,
                count,
                level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4
            });
        }
        contributionData.push(weekData);
    }

    return {
        currentStreak: streak,
        totalContributions: Object.values(eventsByDate).reduce((a, b) => a + b, 0),
        contributionData
    };
}

/**
 * Get aggregated GitHub stats
 */
export async function getGitHubStats() {
    try {
        const [profile, repos, activity, streak] = await Promise.all([
            getUserProfile(),
            getRepositories(),
            getParsedActivity(),
            getContributionStreak()
        ]);

        // Calculate stats from repos
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = await getLanguageStats();

        // Get featured repos (most starred, excluding forks)
        const featuredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        // Calculate account age
        const createdDate = new Date(profile.created_at);
        const now = new Date();
        const yearsOnGitHub = Math.floor((now - createdDate) / (365.25 * 24 * 60 * 60 * 1000));

        return {
            profile: {
                name: profile.name || profile.login,
                login: profile.login,
                avatar: profile.avatar_url,
                bio: profile.bio,
                location: profile.location,
                company: profile.company,
                blog: profile.blog,
                publicRepos: profile.public_repos,
                followers: profile.followers,
                following: profile.following,
                createdAt: profile.created_at,
                yearsOnGitHub
            },
            stats: {
                totalRepos: repos.filter(r => !r.fork).length,
                totalStars,
                totalForks,
                followers: profile.followers,
                contributions: streak.totalContributions,
                currentStreak: streak.currentStreak
            },
            languages,
            featuredRepos: featuredRepos.map(repo => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                homepage: repo.homepage,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                updatedAt: repo.updated_at,
                topics: repo.topics || []
            })),
            activity,
            contributionData: streak.contributionData
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
}

/**
 * Get last commit date for the portfolio repo
 */
export async function getLastCommitDate(repoName = 'page') {
    try {
        const url = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=1`;
        const commits = await fetchWithCache(url);

        if (commits && commits.length > 0) {
            const lastCommit = commits[0];
            return {
                date: new Date(lastCommit.commit.committer.date),
                message: lastCommit.commit.message.split('\n')[0],
                sha: lastCommit.sha.substring(0, 7),
                author: lastCommit.commit.author.name
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching last commit:', error);
        return null;
    }
}

// Language colors mapping (GitHub official colors)
export const languageColors = {
    'Java': '#b07219',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'C++': '#f34b7d',
    'C#': '#178600',
    'C': '#555555',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Shell': '#89e051',
    'Dockerfile': '#384d54',
    'Vue': '#41b883',
    'SCSS': '#c6538c',
    'Astro': '#ff5a03',
    'Dart': '#00B4AB',
    'Scala': '#c22d40',
    'Elixir': '#6e4a7e',
    'Haskell': '#5e5086',
    'Lua': '#000080',
    'Perl': '#0298c3',
    'R': '#198CE7',
    'MATLAB': '#e16737',
    'Jupyter Notebook': '#DA5B0B',
    'Makefile': '#427819',
    'PowerShell': '#012456',
    'Groovy': '#4298b8',
    'Objective-C': '#438eff'
};
