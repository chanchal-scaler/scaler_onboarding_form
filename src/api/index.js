import {
  FORM_GROUP_PATH,
  FORM_SUBMIT_PATH,
  INITIAL_LOAD_DATA_PATH,
  ONBOARDING_COMPLETED_TRACKING_PATH,
  toUrl,
} from "./config";
import { AuthError } from "../authError";
import { apiFetch } from "./httpClient";
import { resolveAuthToken } from "./tokenAuth";

export function fetchInitialLoadData() {
  return apiFetch(INITIAL_LOAD_DATA_PATH);
}

export function fetchOnboardingFormGroup() {
  return apiFetch(FORM_GROUP_PATH);
}

export function submitOnboardingForm(payload) {
  return submitFormResponses(payload);
}

async function submitFormResponses(payload) {
  const token = await resolveAuthToken();
  if (!token) {
    throw new AuthError("Could not generate auth token from /generate-jwt. Please log in and try again.", 401);
  }

  const response = await fetch(toUrl(FORM_SUBMIT_PATH), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-User-Token": token,
    },
    body: JSON.stringify(payload),
  });
  if (response.status === 401 || response.status === 403) {
    throw new AuthError("Your Scaler session has expired. Please log in and try again.", response.status);
  }
  if (!response.ok) throw new Error(`Request failed (${response.status}): ${await response.text()}`);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json();
}

export function trackOnboardingCompleted() {
  return apiFetch(ONBOARDING_COMPLETED_TRACKING_PATH, { method: "GET" });
}
