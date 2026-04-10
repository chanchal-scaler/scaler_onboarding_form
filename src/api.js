import { AuthError } from "./authError";

const INITIAL_LOAD_DATA_PATH = "/academy/mentee-dashboard/initial-load-data/";
const FORM_GROUP_PATH =
  "/api/v3/interviewbit_form_groups?search_by=label&label[]=Onboarding_Form_Academy_V3";
const FORM_SUBMIT_PATH = "/api/v3/interviewbit_form_responses";
const ONBOARDING_COMPLETED_TRACKING_PATH =
  "/api/v3/action-trackings/mentee_completed_onboarding";
const GENERATE_JWT_PATH = "/generate-jwt";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_AUTH_PATHS = [
  FORM_SUBMIT_PATH,
  ONBOARDING_COMPLETED_TRACKING_PATH,
];
let userLoginTokenCache = null;

function getCookieValue(name) {
  if (typeof document === "undefined") return null;
  const escapedName = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function extractToken(payload) {
  if (!payload || typeof payload !== "object") return null;
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

async function resolveAuthToken() {
  if (userLoginTokenCache) return userLoginTokenCache;

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
    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    const payload = await response.json();
    const jwtToken = extractToken(payload);
    if (jwtToken) return jwtToken;
  } catch {
    // Fallback to cookie token for environments where /generate-jwt is unavailable.
  }

  const cookieToken = getCookieValue("access_token");
  if (cookieToken) return cookieToken;

  return null;
}

function buildHeaders(method, customHeaders = {}, authToken = null) {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  if (authToken) {
    headers.Authorization = headers.Authorization || `Bearer ${authToken}`;
    headers["X-User-Token"] = headers["X-User-Token"] || authToken;
  }
  const normalizedMethod = String(method || "GET").toUpperCase();
  const requiresCsrf = !["GET", "HEAD", "OPTIONS"].includes(normalizedMethod);

  if (requiresCsrf) {
    const csrfToken = getCookieValue("XSRF-TOKEN");
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    headers["X-Requested-With"] = "XMLHttpRequest";
  }

  return headers;
}

function requiresTokenAuth(path) {
  return TOKEN_AUTH_PATHS.some((tokenPath) => path.startsWith(tokenPath));
}

function toUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function apiFetch(path, options = {}) {
  const method = options.method || "GET";
  const authToken = requiresTokenAuth(path) ? await resolveAuthToken() : null;
  const response = await fetch(toUrl(path), {
    credentials: "include",
    headers: buildHeaders(method, options.headers || {}, authToken),
    ...options,
  });

  if (response.status === 401 || response.status === 403) {
    throw new AuthError("Your Scaler session has expired. Please log in and try again.", response.status);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Request failed (${response.status}): ${message}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export function fetchInitialLoadData() {
  return apiFetch(INITIAL_LOAD_DATA_PATH).then((data) => {
    const loginToken = data?.user_data?.current_user?.login_token;
    if (loginToken) {
      userLoginTokenCache = loginToken;
    }
    return data;
  });
}

export function fetchOnboardingFormGroup() {
  return apiFetch(FORM_GROUP_PATH);
}

export function submitOnboardingForm(payload) {
  return apiFetch(FORM_SUBMIT_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function trackOnboardingCompleted() {
  return apiFetch(ONBOARDING_COMPLETED_TRACKING_PATH, {
    method: "GET",
  });
}
