export function LoadingScreen() {
  return (
    <section className="screen default-screen loading-screen" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" role="presentation" aria-hidden="true" />
    </section>
  );
}
