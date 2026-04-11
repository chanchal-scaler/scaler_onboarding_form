import { COURSE_TYPES } from "./constants";
import { PAYMENT_STRUCTURE } from "./paymentStructure";
import { PLACEMENT_EXPECTATIONS } from "./placementExpectation";
import { PROGRAM_STRUCTURE } from "./programStructure";

export const EXPECTATION_AGREEMENT_INFO = {
  [COURSE_TYPES.expectation_form_devops_v2]: {
    program_structure: {
      header: "Program Structure",
      implications: PROGRAM_STRUCTURE[COURSE_TYPES.expectation_form_devops_v2],
    },
    placement_expectations: {
      header: "Career Assistance",
      implications: PLACEMENT_EXPECTATIONS[COURSE_TYPES.expectation_form_devops_v2],
    },
    payment_structure: {
      header: "Payment Structure",
      implications: PAYMENT_STRUCTURE[COURSE_TYPES.expectation_form_devops_v2],
    },
  },
  [COURSE_TYPES.expectation_form_academy_v2]: {
    program_structure: {
      header: "Program Structure",
      implications: PROGRAM_STRUCTURE[COURSE_TYPES.expectation_form_academy_v2],
    },
    placement_expectations: {
      header: "Career Assistance",
      implications: PLACEMENT_EXPECTATIONS[COURSE_TYPES.expectation_form_academy_v2],
    },
    payment_structure: {
      header: "Payment Structure",
      implications: PAYMENT_STRUCTURE[COURSE_TYPES.expectation_form_academy_v2],
    },
  },
  [COURSE_TYPES.expectation_form_ds_v2]: {
    program_structure: {
      header: "Program Structure",
      implications: PROGRAM_STRUCTURE[COURSE_TYPES.expectation_form_ds_v2],
    },
    placement_expectations: {
      header: "Career Assistance",
      implications: PLACEMENT_EXPECTATIONS[COURSE_TYPES.expectation_form_ds_v2],
    },
    payment_structure: {
      header: "Payment Structure",
      implications: PAYMENT_STRUCTURE[COURSE_TYPES.expectation_form_ds_v2],
    },
  },
  [COURSE_TYPES.expectation_form_ai_ml_v2]: {
    program_structure: {
      header: "Program Structure",
      implications: PROGRAM_STRUCTURE[COURSE_TYPES.expectation_form_ai_ml_v2],
    },
    placement_expectations: {
      header: "Career Assistance",
      implications: PLACEMENT_EXPECTATIONS[COURSE_TYPES.expectation_form_ai_ml_v2],
    },
    payment_structure: {
      header: "Payment Structure",
      implications: PAYMENT_STRUCTURE[COURSE_TYPES.expectation_form_ai_ml_v2],
    },
  },
};
