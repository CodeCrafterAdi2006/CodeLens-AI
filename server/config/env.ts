import dotenv from 'dotenv';
import path from 'path';

// 1. Load environment variables from the root .env file.
// Dotenv reads key-value configurations and writes them directly to Node's process.env.
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Critical variables without which the core security/auth pipeline cannot function.
const REQUIRED_ENVS = ['JWT_SECRET'] as const;

// 2. Validate critical required keys (Fail-Fast boot check)
// If any required variables are missing, the server crashes immediately with exit code 1.
for (const key of REQUIRED_ENVS) {
    if (!process.env[key]) {
        // Note: \x1b[31m is the ANSI color escape code to format console logs in red text
        console.error(`\x1b[31m[CRITICAL BOOT ERROR] Missing required environment variable: ${key}\x1b[0m`);
        console.error(`Please define ${key} in your .env file before starting the server.`);
        process.exit(1);
    }
}

// 3. Warn about optional but recommended keys
// Gemini key is optional because the server has a rule-based heuristics fallback engine.
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    // Note: \x1b[33m is the ANSI color escape code to format console logs in yellow text
    console.warn(
        `\x1b[33m[BOOT WARNING] GEMINI_API_KEY is not defined. The server will run, but will fallback to the Rule-Based Heuristic Scraper.\x1b[0m`
    );
} else {
    console.log(`[BOOT] GEMINI_API_KEY detected. AI Engine will initialize.`);
}

// 4. Context-Aware Validation (Production vs. Local)
// A missing APP_URL in local dev is fine (defaults to localhost), but in production,
// it causes shared links to break silently. We treat it as critical only in production.
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.APP_URL || process.env.APP_URL === 'MY_APP_URL') {
    if (isProduction) {
        console.error(
            `\x1b[31m[CRITICAL BOOT ERROR] APP_URL must be defined in production mode!\x1b[0m`
        );
        process.exit(1);
    } else {
        console.warn(
            `\x1b[33m[BOOT WARNING] APP_URL is not defined or is set to the default placeholder. Defaulting to http://localhost:3000.\x1b[0m`
        );
    }
}

// 5. Export structured, validated configurations.
// Using non-null assertion (!) because the loop above guarantees JWT_SECRET is defined.
export const env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    PORT: process.env.PORT || 3001,
};
