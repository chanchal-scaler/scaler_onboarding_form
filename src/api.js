import { AuthError } from "./authError";

const INITIAL_LOAD_DATA_PATH = "/academy/mentee-dashboard/initial-load-data/";
const FORM_GROUP_PATH =
  "/api/v3/interviewbit_form_groups?search_by=label&label[]=Onboarding_Form_Academy_V3";
const FORM_SUBMIT_PATH = "/api/v3/interviewbit_form_responses";
const ONBOARDING_COMPLETED_TRACKING_PATH =
  "/api/v3/action-trackings/mentee_completed_onboarding";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function toUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(toUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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
  return apiFetch(INITIAL_LOAD_DATA_PATH);
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
