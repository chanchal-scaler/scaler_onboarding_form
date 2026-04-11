import mixpanel from "mixpanel-browser";

const token = import.meta.env.VITE_MIXPANEL_TOKEN;

/** Super-property on all events (Mixpanel `register`). */
export const PRODUCT_NAME = "on boarding form v3";

let initialized = false;
/** Cached for every `track()` payload and super-properties */
let cachedUserEmail = null;

/**
 * Mixpanel is initialized only when `VITE_MIXPANEL_TOKEN` is set (see `.env` / deployment env).
 * Safe to import in dev without a token — helpers no-op.
 */
export function initMixpanel() {
  if (!token) {
    if (import.meta.env.DEV) {
      console.info("[analytics] Mixpanel disabled (set VITE_MIXPANEL_TOKEN to enable).");
    }
    return;
  }

  mixpanel.init(token, {
    debug: import.meta.env.DEV,
    persistence: "localStorage",
    track_pageview: true,
    ignore_dnt: false,
  });
  mixpanel.register({ product_name: PRODUCT_NAME });
  initialized = true;
}

function extractEmail(user) {
  if (!user || typeof user !== "object") return null;
  return (
    user.email ??
    user.user_email ??
    user.primary_email ??
    user.contact_email ??
    user.professional_email ??
    user.profile?.email ??
    null
  );
}

function extractDistinctId(user, email) {
  if (!user || typeof user !== "object") return email || null;
  if (user.id != null) return String(user.id);
  if (user.uuid != null) return String(user.uuid);
  if (user.sbat_user_id != null) return String(user.sbat_user_id);
  if (email) return email;
  return null;
}

/**
 * Call when `current_user` (or equivalent) is available so events carry email and People profile is set.
 */
export function registerUserContext(user) {
  cachedUserEmail = extractEmail(user);

  if (!initialized) return;

  if (!user) {
    return;
  }

  const email = cachedUserEmail;
  const distinctId = extractDistinctId(user, email);

  if (distinctId) {
    mixpanel.identify(distinctId);
  }

  if (email) {
    mixpanel.register({ email, user_email: email });
    mixpanel.people.set({
      $email: email,
      product_name: PRODUCT_NAME,
      ...(user.name ? { $name: String(user.name) } : {}),
    });
  } else if (user.name) {
    mixpanel.people.set({ $name: String(user.name), product_name: PRODUCT_NAME });
  } else {
    mixpanel.people.set({ product_name: PRODUCT_NAME });
  }
}

const SCREEN_VIEW_LABELS = {
  loading: "Loading",
  auth_error: "Auth Error",
  error: "Error",
  awaiting_expectation_branch: "Awaiting Expectation",
  home: "Home",
  form: "Form",
  letter: "Welcome Letter",
  expectation: "Enrollment Agreement",
  timeline: "Roadmap",
};

/**
 * Fires when the user-visible app screen changes (phase and, on the form flow, each step).
 * `product_name` is already a registered super-property; we also pass it on the event for clarity in exports.
 */
export function trackScreenView(screenKey, extraProps = {}) {
  const screen_name = SCREEN_VIEW_LABELS[screenKey] ?? String(screenKey);
  track("Screen View", {
    screen_key: screenKey,
    screen_name,
    product_name: PRODUCT_NAME,
    ...extraProps,
  });
}

/** @param {string} eventName @param {Record<string, unknown>} [props] */
export function track(eventName, props) {
  if (!initialized) return;
  mixpanel.track(eventName, {
    ...props,
    ...(cachedUserEmail ? { email: cachedUserEmail, user_email: cachedUserEmail } : {}),
    product_name: PRODUCT_NAME,
  });
}

/** @param {string} userId @param {Record<string, unknown>} [props] */
export function identify(userId, props) {
  if (!initialized) return;
  mixpanel.identify(userId);
  if (props && Object.keys(props).length) {
    mixpanel.people.set(props);
  }
}

export { mixpanel };
