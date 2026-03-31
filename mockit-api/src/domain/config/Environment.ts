interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    GOOGLE_GEMINI_API_KEY: string;
    GOOGLE_GEMINI_API_MODEL: string;
    LLM_RESPONSE_MINE_TYPE: string;
}

try {
    process.loadEnvFile();    
} catch (error) {
    console.error(error);
}

export const { NODE_ENV, GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_API_MODEL, LLM_RESPONSE_MINE_TYPE } = process.env;