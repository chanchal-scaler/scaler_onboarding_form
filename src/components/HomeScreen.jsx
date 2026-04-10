import { publicAsset } from "../utils/publicAsset";

export function HomeScreen({ onStart }) {
  return (
    <section className="screen default-screen home-screen" id="screen-1">
      <div className="frame welcome-frame">
        <main className="content welcome-content">
          <div className="topbar">
            <div className="topbar-left">
              <div className="ghost-chip">
                <i className="ph ph-squares-four" aria-hidden />
              </div>
              <div className="step-meta">
                <div className="step-overline">Built for the AI-first world</div>
                <div className="step-title">Welcome to Scaler</div>
              </div>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ "--progress": "8%" }}>
                <span />
              </div>
              <div className="progress-label">Intro</div>
            </div>
          </div>

          <div className="hero-grid welcome-stage">
            <div>
              <div className="eyebrow">A founder welcome</div>
              <h2 className="hero-title">
                The most important skill of this decade is already here. Let&apos;s make sure you&apos;re
                ready for it.
              </h2>
              <p className="hero-copy">
                We built Scaler because the gap between where professionals are and where AI is taking
                every industry was becoming unbridgeable without the right training. This program
                doesn&apos;t just teach you AI. It teaches you how to think, build, and lead in a world
                shaped by it.
              </p>
              <div className="quote-block">
                <p className="quote-text">&ldquo;1% better every day.&rdquo;</p>
                <div className="quote-meta">
                  <span className="signature-line" />
                  Founding team, Scaler
                </div>
              </div>
              <div className="cta-row">
                <button className="button" type="button" onClick={onStart}>
                  Complete onboarding <i className="ph ph-arrow-right" aria-hidden />
                </button>
                <div className="status-line">
                  <i className="ph ph-lock-key" aria-hidden />
                  A short intake before your dashboard opens
                </div>
              </div>
            </div>
          </div>
          <div className="welcome-wheel" aria-hidden="true">
            <img src={publicAsset("/Union.png")} alt="" />
          </div>
        </main>
      </div>
    </section>
  );
}
