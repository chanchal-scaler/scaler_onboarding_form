/* eslint-disable max-len */

export const COURSE_TYPES = {
  expectation_form_academy: "Scaler Academy",
  expectation_form_ds: "Scaler DSML",
  expectation_form_devops: "Scaler Dev Ops",
  expectation_form_ds_v2: "Scaler DSML",
  expectation_form_ai_ml_v2: "Scaler AIML",
  expectation_form_devops_v2: "Scaler DevOps",
  expectation_form_academy_v2: "Scaler Academy",
};

export const COURSE_TITLES = {
  [COURSE_TYPES.expectation_form_academy]: "Scaler Academy",
  [COURSE_TYPES.expectation_form_ds]: "Scaler DSML",
  [COURSE_TYPES.expectation_form_devops]: "Scaler DevOps",
  [COURSE_TYPES.expectation_form_ds_v2]: "Scaler DSML",
  [COURSE_TYPES.expectation_form_devops_v2]: "Scaler DevOps",
  [COURSE_TYPES.expectation_form_academy_v2]: "Scaler Academy",
  [COURSE_TYPES.expectation_form_ai_ml_v2]: "Scaler AIML",
};

export const EXPECTATION_AGREEMENT_V2_INTRODUCTION =
  "We feel that it is very important that you are starting this course with the right mindset and expectations from the program. To ensure this we would request you to go through this document and confirm your alignment by signing off on the same.";

/** Copy inside the gradient shell (below “Welcome to Scaler!”) — matches Railway FTUE document block. */
export const AGREEMENT_SHELL_WELCOME_LEAD =
  "At Scaler, transparent communication is a core value. As you start your upskilling journey, we want to ensure that you have all the important information available to you.";

export const LANDING_BANNER_TEXT = AGREEMENT_SHELL_WELCOME_LEAD;

/** Narrative block above the agreement (Ftue screen-t-agreement / Railway FTUE). */
export const EXPECTATION_AGREEMENT_EYEBROW = "Course enrollment agreement";

export const EXPECTATION_AGREEMENT_SECTION_TITLE = "One final sign-off before starting your journey";

/** Same wording as Ftue/Railway hero line (includes original copy quirks). */
export const EXPECTATION_AGREEMENT_SECTION_SUBTITLE =
  "At Scaler, transparant comunication is a core value, and we want to ensure that you have all the important information available to you. Review the agreement below to continue.";

export const SIGNATURE_REGEX = /^[A-Za-z .]{1,90}$/;

export const DEFAULT_EXPECTATION_COURSE_KEY = "expectation_form_academy_v2";
