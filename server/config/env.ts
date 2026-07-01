import dotenv from 'dotenv'
import path from 'path'

// Load the environment variables from the root .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });
const REQUIRED_ENVS = ['JWT_SECRET'] as const;
// 1. Validate critical required keys (Fail-Fast)
for (const key of REQUIRED_ENVS) {
    if (!process.env[key]) {
        console.error(`\x1b[31m[CRITICAL BOOT ERROR] Missing required environment variable: ${key}\x1b[0m`);
        console.error(`Please define ${key} in your .env file before starting the server.`);
        process.exit(1); // Crash the process immediately with an exit code of 1
    }
}

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    console.warn(
        `\x1b[33m[BOOT WARNING] GEMINI_API_KEY is not defined. The server will run, but will fallback to the Rule-Based Heuristic Scraper. \x1b[0m`
    );
}
else {
    console.log(`[BOOT] GEMINI_API_KEY detected. AI Engine will initialize.`);
}

export const env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    PORT: process.env.PORT || 3001,
};

if (!process.env.APP_URL || process.env.APP_URL === 'MY_APP_URL') {
    console.warn(
        `\x1b[33m[BOOT WARNING] APP_URL is not defined or is set to the default placeholder. Defaulting to http://localhost:3000.\x1b[0m`
    );
}
