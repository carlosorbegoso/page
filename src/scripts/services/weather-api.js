/**
 * Weather API Service
 * Uses Open-Meteo API - Free, no auth required, CORS enabled
 * Location: Lima, Peru (default)
 */

// Lima, Peru coordinates
const DEFAULT_LAT = -12.0464;
const DEFAULT_LON = -77.0428;
const DEFAULT_TIMEZONE = 'America/Lima';

// Cache
let cachedWeather = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Weather code to description and icon mapping
 */
const weatherCodes = {
    0: { description: 'Clear sky', icon: 'fa-sun', isDay: 'fa-sun', isNight: 'fa-moon' },
    1: { description: 'Mainly clear', icon: 'fa-sun', isDay: 'fa-sun', isNight: 'fa-moon' },
    2: { description: 'Partly cloudy', icon: 'fa-cloud-sun', isDay: 'fa-cloud-sun', isNight: 'fa-cloud-moon' },
    3: { description: 'Overcast', icon: 'fa-cloud', isDay: 'fa-cloud', isNight: 'fa-cloud' },
    45: { description: 'Foggy', icon: 'fa-smog', isDay: 'fa-smog', isNight: 'fa-smog' },
    48: { description: 'Depositing rime fog', icon: 'fa-smog', isDay: 'fa-smog', isNight: 'fa-smog' },
    51: { description: 'Light drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    53: { description: 'Moderate drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    55: { description: 'Dense drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    61: { description: 'Slight rain', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    63: { description: 'Moderate rain', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    65: { description: 'Heavy rain', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    71: { description: 'Slight snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    73: { description: 'Moderate snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    75: { description: 'Heavy snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    80: { description: 'Slight showers', icon: 'fa-cloud-rain', isDay: 'fa-cloud-sun-rain', isNight: 'fa-cloud-moon-rain' },
    81: { description: 'Moderate showers', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    82: { description: 'Violent showers', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    95: { description: 'Thunderstorm', icon: 'fa-bolt', isDay: 'fa-bolt', isNight: 'fa-bolt' },
    96: { description: 'Thunderstorm with hail', icon: 'fa-bolt', isDay: 'fa-bolt', isNight: 'fa-bolt' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'fa-bolt', isDay: 'fa-bolt', isNight: 'fa-bolt' }
};

/**
 * Get current weather data
 */
export async function getCurrentWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON, timezone = DEFAULT_TIMEZONE) {
    // Check cache
    if (cachedWeather && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedWeather;
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day&timezone=${encodeURIComponent(timezone)}`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            const current = data.current;
            const weatherInfo = weatherCodes[current.weather_code] || weatherCodes[0];

            cachedWeather = {
                temperature: Math.round(current.temperature_2m),
                feelsLike: Math.round(current.apparent_temperature),
                humidity: current.relative_humidity_2m,
                description: weatherInfo.description,
                icon: current.is_day ? weatherInfo.isDay : weatherInfo.isNight,
                isDay: current.is_day === 1,
                timezone: timezone,
                timestamp: new Date().toISOString()
            };

            cacheTimestamp = Date.now();
            return cachedWeather;
        }
    } catch (error) {
        console.log('Open-Meteo API unavailable');
    }

    return null;
}

/**
 * Get current time for a timezone
 */
export function getCurrentTime(timezone = DEFAULT_TIMEZONE) {
    try {
        const now = new Date();
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return now.toLocaleTimeString('en-US', options);
    } catch (error) {
        return null;
    }
}

/**
 * Get current date for a timezone
 */
export function getCurrentDate(timezone = DEFAULT_TIMEZONE) {
    try {
        const now = new Date();
        const options = {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };
        return now.toLocaleDateString('en-US', options);
    } catch (error) {
        return null;
    }
}

/**
 * Get full location/weather info
 */
export async function getLocationInfo() {
    const weather = await getCurrentWeather();
    const time = getCurrentTime();
    const date = getCurrentDate();

    return {
        location: 'Lima, Peru',
        weather,
        time,
        date
    };
}
