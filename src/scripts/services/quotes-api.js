/**
 * Quotes API Service
 * Uses multiple free APIs for programming/tech quotes
 */

// Programming quotes collection (fallback)
const programmingQuotes = [
    { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { content: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
    { content: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
    { content: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { content: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { content: "Java is to JavaScript what car is to carpet.", author: "Chris Heilmann" },
    { content: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" },
    { content: "Knowledge is power.", author: "Francis Bacon" },
    { content: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
    { content: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
    { content: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
    { content: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
    { content: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" },
    { content: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" },
    { content: "It's not a bug – it's an undocumented feature.", author: "Anonymous" }
];

// Cache
let cachedQuote = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get a random programming quote
 */
export async function getRandomQuote() {
    // Check cache
    if (cachedQuote && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedQuote;
    }

    try {
        // Try Quotable API first (has tech/programming quotes)
        const response = await fetch('https://api.quotable.io/random?tags=technology|wisdom|famous-quotes&maxLength=150');

        if (response.ok) {
            const data = await response.json();
            cachedQuote = {
                content: data.content,
                author: data.author
            };
            cacheTimestamp = Date.now();
            return cachedQuote;
        }
    } catch (error) {
        console.log('Quotable API unavailable, using fallback quotes');
    }

    // Fallback to local quotes
    const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
    cachedQuote = programmingQuotes[randomIndex];
    cacheTimestamp = Date.now();
    return cachedQuote;
}

/**
 * Get quote of the day (changes daily)
 */
export function getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % programmingQuotes.length;
    return programmingQuotes[index];
}
