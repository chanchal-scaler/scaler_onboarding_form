export function LoadingScreen() {
  return (
    <section className="screen default-screen loading-screen" aria-live="polite" aria-busy="true">
      <div className="loading-card">
        <div className="loading-spinner" />
        <p className="loading-kicker">Preparing your onboarding</p>
        <h1 className="loading-title">Just a moment while we set things up.</h1>
        <p className="loading-message">Fetching your latest progress and personalized flow.</p>
      </div>
    </section>
  );
}
