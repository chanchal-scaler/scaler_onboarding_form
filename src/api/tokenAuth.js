import { GENERATE_JWT_PATH, toUrl } from "./config";
import { getCookieValue } from "./cookies";

let generatedJwtCache = null;
let generatedJwtPromise = null;

function extractToken(payload) {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (typeof payload !== "object") return null;
  return (
    payload.token ||
    payload.jwt ||
    payload.access_token ||
    payload?.data?.token ||
    payload?.data?.jwt ||
    payload?.data?.access_token ||
    null
  );
}

export function resetGeneratedJwt() {
  generatedJwtCache = null;
  generatedJwtPromise = null;
}

export async function resolveAuthToken() {
  if (generatedJwtCache) return generatedJwtCache;
  if (generatedJwtPromise) return generatedJwtPromise;

  generatedJwtPromise = (async () => {
    try {
      const csrfToken = getCookieValue("XSRF-TOKEN");
      const response = await fetch(toUrl(GENERATE_JWT_PATH), {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (response.status === 401 || response.status === 403 || !response.ok) return null;
      const rawText = (await response.text()).trim();
      let payload = rawText;
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = rawText;
      }

      const jwtToken = extractToken(payload);
      if (jwtToken) generatedJwtCache = jwtToken;
      return jwtToken;
    } catch {
      return null;
    } finally {
      generatedJwtPromise = null;
    }
  })();

  return generatedJwtPromise;
}
