import { AuthError } from "../authError";
import { TOKEN_AUTH_PATHS, toUrl } from "./config";
import { getCookieValue } from "./cookies";
import { resetGeneratedJwt, resolveAuthToken } from "./tokenAuth";

function requiresTokenAuth(path) {
  return TOKEN_AUTH_PATHS.some((tokenPath) => path.startsWith(tokenPath));
}

function buildHeaders(method, customHeaders = {}, authToken = null) {
  const headers = { "Content-Type": "application/json", ...customHeaders };
  if (authToken) headers["X-User-Token"] = headers["X-User-Token"] || authToken;
  const normalizedMethod = String(method || "GET").toUpperCase();
  const requiresCsrf = !["GET", "HEAD", "OPTIONS"].includes(normalizedMethod);
  if (requiresCsrf) {
    const csrfToken = getCookieValue("XSRF-TOKEN");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
    headers["X-Requested-With"] = "XMLHttpRequest";
  }
  return headers;
}

export async function apiFetch(path, options = {}) {
  const method = options.method || "GET";
  const optionalAuth = options.optionalAuth === true;
  const tokenRequired = requiresTokenAuth(path);
  let authToken = tokenRequired ? await resolveAuthToken() : null;
  if (tokenRequired && !authToken && !optionalAuth) {
    throw new AuthError("Could not generate auth token from /generate-jwt. Please log in and try again.", 401);
  }

  const { optionalAuth: _omitOptionalAuth, headers: optionHeaders, ...restFetchOptions } = options;

  let response = await fetch(toUrl(path), {
    credentials: "include",
    headers: buildHeaders(method, optionHeaders || {}, authToken),
    ...restFetchOptions,
  });

  if ((response.status === 401 || response.status === 403) && tokenRequired) {
    resetGeneratedJwt();
    authToken = await resolveAuthToken();
    if (authToken) {
      response = await fetch(toUrl(path), {
        credentials: "include",
        headers: buildHeaders(method, optionHeaders || {}, authToken),
        ...restFetchOptions,
      });
    }
  }

  if (response.status === 401 || response.status === 403) {
    throw new AuthError("Your Scaler session has expired. Please log in and try again.", response.status);
  }
  if (!response.ok) throw new Error(`Request failed (${response.status}): ${await response.text()}`);
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json();
}
