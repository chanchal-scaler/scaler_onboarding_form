/** Resolve a public/ path for Vite `base` (e.g. /mentee-onboarding/). */
export function publicAsset(path) {
  const rel = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${rel}`;
}
