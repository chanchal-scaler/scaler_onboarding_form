/**
 * Client-side validators for `interviewbit_form` `meta.validation_type`.
 * Returns `true` when valid, or an error message string.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** YYYY-MM-DD (e.g. native date input) or DD/MM/YYYY */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DMY_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

/** India PIN: 6 digits, first not 0 */
const PINCODE_IN = /^[1-9]\d{5}$/;

/** E.164-style country calling code: + optional, 1–4 digits after leading country digit */
const COUNTRY_CODE_RE = /^\+?[1-9]\d{0,3}$/;

const LINKEDIN_RE =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company|school|showcase)\/[^/\s]+\/?(\?.*)?$/i;

export const VALIDATION_TYPES = [
  "email",
  "date_of_birth",
  "pincode",
  "country_code",
  "phone_number",
  "linkedin_url",
];

export function normalizeValidationType(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  return VALIDATION_TYPES.includes(s) ? s : null;
}

function parseDobParts(v) {
  const iso = v.match(ISO_DATE);
  if (iso) {
    const y = +iso[1];
    const mo = +iso[2];
    const d = +iso[3];
    const dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
      return null;
    }
    return dt;
  }
  const dmy = v.match(DMY_DATE);
  if (dmy) {
    const d = +dmy[1];
    const mo = +dmy[2];
    const y = +dmy[3];
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }
  return null;
}

export function validateByMetaType(validationType, rawValue) {
  const v = String(rawValue ?? "").trim();
  if (!validationType || !v) return true;

  switch (validationType) {
    case "email":
      return EMAIL_RE.test(v) ? true : "Please enter a valid email address.";
    case "date_of_birth": {
      const dt = parseDobParts(v);
      if (!dt) return "Enter a valid date (YYYY-MM-DD or DD/MM/YYYY).";
      const now = new Date();
      let age = now.getFullYear() - dt.getFullYear();
      const m = now.getMonth() - dt.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age -= 1;
      if (age < 15) return "You must be at least 15 years old.";
      if (age > 120) return "Please enter a realistic date of birth.";
      return true;
    }
    case "pincode":
      return PINCODE_IN.test(v.replace(/\s/g, ""))
        ? true
        : "Please enter a valid 6-digit PIN code.";
    case "country_code": {
      const compact = v.replace(/\s/g, "");
      return COUNTRY_CODE_RE.test(compact)
        ? true
        : "Please enter a valid country code (e.g. +91).";
    }
    case "phone_number": {
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 8 && digits.length <= 15) return true;
      return "Please enter a valid phone number (8–15 digits).";
    }
    case "linkedin_url":
      return LINKEDIN_RE.test(v) ? true : "Please enter a valid LinkedIn profile URL.";
    default:
      return true;
  }
}

/**
 * react-hook-form options for text-like fields when `field.validationType` is set from meta.
 */
export function getRegisterOptionsForValidationType(field) {
  if (!field.validationType) {
    return { required: field.required ? "This field is required." : false };
  }
  return {
    validate: (value) => {
      const s = String(value ?? "").trim();
      if (!s) return field.required ? "This field is required." : true;
      const err = validateByMetaType(field.validationType, s);
      return err === true ? true : err;
    },
  };
}
