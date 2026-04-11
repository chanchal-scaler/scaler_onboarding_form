import { EXPECTATION_FORM_PATH_PREFIX } from "./config";
import { apiFetch } from "./httpClient";

export function expectationFormDetailUrl(slug, course) {
  const qs = new URLSearchParams({ slug, course });
  return `${EXPECTATION_FORM_PATH_PREFIX}/?${qs.toString()}`;
}

export function fetchExpectationFormDetail(slug, course) {
  return apiFetch(expectationFormDetailUrl(slug, course));
}

export function submitExpectationFormResponse({
  formGroupLabel,
  slug,
  responses,
  utmSource,
  /** Cloudflare Turnstile token (same key as myinterviewtrainer expectation_setting). */
  recaptchaToken,
}) {
  return apiFetch(`${EXPECTATION_FORM_PATH_PREFIX}/submit-form`, {
    method: "POST",
    body: JSON.stringify({
      form_group_label: formGroupLabel,
      slug,
      responses,
      final_submit: true,
      ...(recaptchaToken != null && recaptchaToken !== ""
        ? { "cf-turnstile-response": recaptchaToken }
        : {}),
      ...(utmSource != null && utmSource !== "" ? { utm_source: utmSource } : {}),
    }),
  });
}
