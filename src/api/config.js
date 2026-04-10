export const INITIAL_LOAD_DATA_PATH = "/academy/mentee-dashboard/initial-load-data/";
export const FORM_GROUP_PATH =
  "/api/v3/interviewbit_form_groups?search_by=label&label[]=Onboarding_Form_Academy_V3";
export const FORM_SUBMIT_PATH = "/api/v3/interviewbit_form_responses";
export const ONBOARDING_COMPLETED_TRACKING_PATH =
  "/api/v3/action-trackings/mentee_completed_onboarding";
export const GENERATE_JWT_PATH = "/generate-jwt";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const TOKEN_AUTH_PATHS = [FORM_SUBMIT_PATH, ONBOARDING_COMPLETED_TRACKING_PATH];

export function toUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
