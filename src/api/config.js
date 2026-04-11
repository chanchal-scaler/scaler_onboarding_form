export const INITIAL_LOAD_DATA_PATH = "/academy/mentee-dashboard/initial-load-data/";

export function getInterviewbitFormGroupsPath(label) {
  return `/api/v3/interviewbit_form_groups?search_by=label&label[]=${encodeURIComponent(label)}`;
}
export const FORM_SUBMIT_PATH = "/api/v3/interviewbit_form_responses";
/** GET `/api/v3/expectation-form/?slug=&course=` and POST `.../submit-form` (same prefix as myinterviewtrainer expectation_setting). */
export const EXPECTATION_FORM_PATH_PREFIX = "/api/v3/expectation-form";
export const ONBOARDING_COMPLETED_TRACKING_PATH =
  "/api/v3/action-trackings/mentee_completed_onboarding";
export const GENERATE_JWT_PATH = "/generate-jwt";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const TOKEN_AUTH_PATHS = [
  FORM_SUBMIT_PATH,
  ONBOARDING_COMPLETED_TRACKING_PATH,
  EXPECTATION_FORM_PATH_PREFIX,
];

export function toUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
