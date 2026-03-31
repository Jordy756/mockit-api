interface ProcessEnv {
  NODE_ENV: "development" | "production" | "test";
  GOOGLE_GEMINI_API_KEY: string;
  GOOGLE_GEMINI_API_MODEL: string;
  LLM_RESPONSE_MINE_TYPE: string;
  RATE_LIMIT_TIME_LAPSE: number;
  RATE_LIMIT_REQUEST_LIMIT: number;
  RATE_LIMIT_LEGACY_HEADERS: boolean;
}

try {
  process.loadEnvFile();
} catch (error) {
  console.error(error);
}

export const {
  NODE_ENV,
  GOOGLE_GEMINI_API_KEY,
  GOOGLE_GEMINI_API_MODEL,
  LLM_RESPONSE_MINE_TYPE,
  RATE_LIMIT_TIME_LAPSE,
  RATE_LIMIT_REQUEST_LIMIT,
  RATE_LIMIT_LEGACY_HEADERS
} = process.env;
