import {
  FORM_GROUP_PATH,
  FORM_SUBMIT_PATH,
  INITIAL_LOAD_DATA_PATH,
  ONBOARDING_COMPLETED_TRACKING_PATH,
} from "./config";
import { apiFetch } from "./httpClient";

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
  return apiFetch(ONBOARDING_COMPLETED_TRACKING_PATH, { method: "GET" });
}
