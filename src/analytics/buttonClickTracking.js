import { track } from "./mixpanel.js";

function labelFromElement(el) {
  const aria = el.getAttribute("aria-label");
  if (aria?.trim()) return aria.trim().slice(0, 200);
  const text = el.innerText?.replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 200);
  return null;
}

function resolveClickable(target) {
  if (!(target instanceof Element)) return null;
  const el = target.closest(
    "button, a.roadmap-float-btn, a[class*='roadmap-float'], [role='button']",
  );
  return el;
}

/**
 * Delegated capture listener: tracks primary CTAs and all native `<button>` / `role="button"` clicks.
 * Prefer `data-track-id` on the element for stable Mixpanel identifiers.
 */
export function installButtonClickTracking() {
  const onClickCapture = (event) => {
    const el = resolveClickable(event.target);
    if (!el) return;

    const trackId = el.getAttribute("data-track-id");
    const phase = document.documentElement.getAttribute("data-app-phase") || "unknown";
    const label = labelFromElement(el);
    const tag = el.tagName.toLowerCase();
    const type = el.getAttribute("type");
    const href = tag === "a" ? el.getAttribute("href") : null;
    const disabled = el.disabled === true;

    track("Button Click", {
      track_id: trackId || undefined,
      button_identifier: trackId || label || "unknown",
      label: label || undefined,
      tag,
      type: type || undefined,
      href: href || undefined,
      disabled,
      app_phase: phase,
      "aria-label": el.getAttribute("aria-label") || undefined,
    });
  };

  document.addEventListener("click", onClickCapture, true);
  return () => document.removeEventListener("click", onClickCapture, true);
}
