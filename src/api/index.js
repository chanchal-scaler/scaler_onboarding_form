import {
  getInterviewbitFormGroupsPath,
  FORM_SUBMIT_PATH,
  INITIAL_LOAD_DATA_PATH,
  ONBOARDING_COMPLETED_TRACKING_PATH,
  toUrl,
} from "./config";
import { getOnboardingFormGroupLabelV3 } from "../onboardingFormV3Constants";
import { AuthError } from "../authError";
import { apiFetch } from "./httpClient";
import { resolveAuthToken } from "./tokenAuth";

export function fetchInitialLoadData() {
  return apiFetch(INITIAL_LOAD_DATA_PATH);
}

function isMenteeCompletedOnboardingTracking(response) {
  if (!response) return false;
  const data = response?.data;
  const attrs = data?.attributes;
  return (
    data?.type === "action_tracking" &&
    attrs?.action_type === "mentee_completed_onboarding"
  );
}

/** Initial dashboard load, then completion tracking (GET must actually hit the network; JWT is optional via optionalAuth). */
export async function fetchInitialLoadWithCompletionDecision() {
  const initialLoadData = await fetchInitialLoadData();
  const trackingResponse = await fetchOnboardingCompletionTracking().catch(() => null);
  return {
    initialLoadData,
    initialShowTimeline: isMenteeCompletedOnboardingTracking(trackingResponse),
  };
}

export function fetchOnboardingFormGroup(courseSlug) {
  const label = getOnboardingFormGroupLabelV3(courseSlug);
  return apiFetch(getInterviewbitFormGroupsPath(label));
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

export async function fetchOnboardingCompletionTracking() {
  try {
    return await apiFetch(ONBOARDING_COMPLETED_TRACKING_PATH, {
      method: "GET",
      /** Without this, missing JWT made apiFetch throw before fetch() — no request in Network. */
      optionalAuth: true,
    });
  } catch (error) {
    const message = String(error?.message || "");
    if (message.includes("Request failed (404)")) return null;
    throw error;
  }
}
