/** Values match `user_data.course_slug` from `/academy/mentee-dashboard/initial-load-data/`. */
export const COURSE_TYPES = {
  dataScience: "data_science",
  scalerAcademy: "scaler",
  ug: "undergraduate",
  devops: "devops",
  ssb: "mba",
  ai_ml: "ai_ml",
  ansrAcademy: "ansr_academy",
  ansrDevops: "ansr_devops",
  ansrDataAnalytics: "ansr_data_analytics",
  onlineMba: "online_mba",
};

/** `label[]` for `/api/v3/interviewbit_form_groups?search_by=label&label[]=…`. */
export const ONBOARDING_FORM_TYPES_V3 = {
  [COURSE_TYPES.scalerAcademy]: "Onboarding_Form_Academy_V3",
  [COURSE_TYPES.dataScience]: "Onboarding_Form_DSML_V3",
  [COURSE_TYPES.devops]: "Onboarding_Form_Devops_V3",
  [COURSE_TYPES.ai_ml]: "Onboarding_Form_AI_ML_V3",
};

export function getOnboardingFormGroupLabelV3(courseSlug) {
  if (courseSlug && ONBOARDING_FORM_TYPES_V3[courseSlug]) {
    return ONBOARDING_FORM_TYPES_V3[courseSlug];
  }
  return ONBOARDING_FORM_TYPES_V3[COURSE_TYPES.scalerAcademy];
}
