import { COURSE_TYPES } from "./constants";

/** Resolve JSON:API expectation-form GET payload (same shape as myinterviewtrainer). */
export function parseExpectationDetail(data) {
  if (!data || typeof data !== "object") return null;

  const formsAll = data.forms;
  const userCourse = formsAll?.data?.attributes?.label;
  const selectedCourseName = userCourse ? COURSE_TYPES[userCourse] : null;

  const firstIncluded = formsAll?.included?.[0];
  const firstQuestionId =
    firstIncluded?.attributes?.id != null
      ? String(firstIncluded.attributes.id)
      : firstIncluded?.id != null
        ? String(firstIncluded.id)
        : null;

  return {
    formFilled: Boolean(data.form_filled),
    formVersion: data.form_version ?? null,
    updatable: Boolean(data.updatable),
    user: data.user ?? null,
    userCourseKey: userCourse ?? null,
    selectedCourseName: selectedCourseName ?? "Scaler Academy",
    formGroupLabel: userCourse ?? "",
    firstQuestionId,
  };
}
