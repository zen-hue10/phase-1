import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

function readEnv(key: string): string {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined>; loadEnvFile?: (p?: string) => void } }).process;
  let value = proc?.env?.[key];
  if (!value) {
    try {
      proc?.loadEnvFile?.();
    } catch {
      // no .env — handled below
    }
    value = proc?.env?.[key];
  }
  if (!value) {
    throw new Error(`${key} is not configured`);
  }
  return value;
}

export const kimiGw = createOpenAICompatible({
  name: "kimi-gw",
  baseURL: readEnv("KIMI_AGENTGW_BASE_URL"),
  apiKey: readEnv("KIMI_AGENTGW_API_KEY"),
  includeUsage: true,
  supportsStructuredOutputs: true,
});
