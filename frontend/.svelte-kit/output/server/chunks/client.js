import { g as get } from "./index2.js";
import { P as PUBLIC_API_BASE_URL, a as authState } from "./Icon.js";
const API_BASE_URL = PUBLIC_API_BASE_URL;
const inFlightRequests = /* @__PURE__ */ new Map();
const apiCache = /* @__PURE__ */ new Map();
const CACHE_TTL_MS = 1e4;
function clearApiCache() {
  apiCache.clear();
}
if (typeof window !== "undefined") {
  window.addEventListener("clear-api-cache", () => clearApiCache());
  window.addEventListener("resource-added", () => clearApiCache());
}
async function apiRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const isGet = method === "GET";
  if (!isGet) {
    clearApiCache();
  }
  const currentAuth = get(authState);
  const token = currentAuth?.session?.access_token;
  const currentResidentId = currentAuth?.resident?.id;
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else if (currentResidentId) {
    headers.set("Authorization", `Bearer demo-token-${currentResidentId}`);
    headers.set("x-demo-user-id", currentResidentId);
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const primaryUrl = `${API_BASE_URL}${cleanEndpoint}`;
  const cacheKey = `${method}:${currentResidentId || "anon"}:${primaryUrl}`;
  if (isGet && !options.skipCache) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    const inFlight = inFlightRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }
  }
  const executeFetch = async () => {
    async function parseSafeResponse(res) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          return await res.json();
        } catch {
        }
      }
      const rawText = await res.text().catch(() => "");
      if (!res.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${res.status}`,
            message: `Server returned HTTP ${res.status}`
          }
        };
      }
      try {
        return JSON.parse(rawText);
      } catch {
        return {
          success: true,
          data: rawText
        };
      }
    }
    try {
      const response = await fetch(primaryUrl, {
        ...options,
        headers
      });
      const data = await parseSafeResponse(response);
      if (isGet && data.success) {
        apiCache.set(cacheKey, {
          timestamp: Date.now(),
          data
        });
      }
      return data;
    } catch (err) {
      const altBase = API_BASE_URL.includes("127.0.0.1") ? API_BASE_URL.replace("127.0.0.1", "localhost") : API_BASE_URL.replace("localhost", "127.0.0.1");
      try {
        const fallbackResponse = await fetch(`${altBase}${cleanEndpoint}`, {
          ...options,
          headers
        });
        const fallbackData = await parseSafeResponse(fallbackResponse);
        if (isGet && fallbackData.success) {
          apiCache.set(cacheKey, {
            timestamp: Date.now(),
            data: fallbackData
          });
        }
        return fallbackData;
      } catch {
        return {
          success: false,
          error: {
            code: "NETWORK_ERROR",
            message: err?.message || "Gagal menghubungi server backend (Hono API). Pastikan API berjalan di port 8787."
          }
        };
      }
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  };
  if (isGet) {
    const fetchPromise = executeFetch();
    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }
  return executeFetch();
}
export {
  apiRequest as a
};
