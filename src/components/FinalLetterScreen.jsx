import { publicAsset } from "../utils/publicAsset";

const alumni = [
  {
    name: "Mayank Chauhan",
    role: "SDE 2 at CYware",
    before: "Fresher",
    company: "CYware",
    photo: "/assets/alumni/mayank-chauhan.jpeg",
    logo: "/assets/alumni/logos/cyware.png",
  },
  {
    name: "Saurabh Singh",
    role: "SDE - Full Stack @ Lido",
    before: "Fresher",
    company: "Lido",
    photo: "/assets/alumni/saurabh-singh.jpeg",
    logo: "/assets/alumni/logos/lido.jpeg",
  },
  {
    name: "Siddharth Aadarsh",
    role: "Backend Developer @ HealthifyMe",
    before: "Fresher",
    company: "HealthifyMe",
    photo: "/assets/alumni/siddharth-aadarsh.jpeg",
    logo: "/assets/alumni/logos/healthifyme.png",
  },
];

export function FinalLetterScreen({ user, onContinue, continueDisabled = false }) {
  const userName = user?.name || "Learner";

  return (
    <section className="screen default-screen shell page letter-screen">
      <div className="letter-frame letter-page">
        <p className="eyebrow letter-eyebrow">Welcome note</p>
        <h1 className="headline">
          {userName}, your journey to staying relevant, starts now
        </h1>
        <p className="subheadline">(50+ learners have already enrolled, with similar profile like you)</p>
        <p className="subheading">Scaler alumni who had a similar journey as yours</p>

        <div className="alumni-strip">
          {alumni.map((card) => (
            <article key={card.name} className="alumni-card">
              <div className="alumni-top">
                <img className="alumni-photo" src={publicAsset(card.photo)} alt={card.name} />
                <div className="alumni-meta">
                  <div className="alumni-name">{card.name}</div>
                  <div className="alumni-role">{card.role}</div>
                </div>
              </div>
              <div className="alumni-journey">
                <div className="journey-row">
                  <div className="journey-label">Before Scaler</div>
                  <div className="journey-value">{card.before}</div>
                </div>
                <div className="journey-row">
                  <div className="journey-label">After Scaler</div>
                  <div className="org-logo">
                    <img src={publicAsset(card.logo)} alt={card.company} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="letter-card letter-card--mission">
          <h2 className="insight-section-title">Scaler&apos;s mission and your future with AI</h2>
          <p className="insight-section-subtitle">How Scaler helps you stay relevant with AI</p>

          <section className="insight-grid">
            <article className="insight-panel insight-panel--concerns">
              <div className="insight-panel-head">
                <div className="insight-icon" aria-hidden>
                  <i className="ph ph-user-focus" />
                </div>
                <h3>Common conerns around using AI</h3>
              </div>
              <ul className="insight-list">
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-x" />
                  </span>
                  <span>Outputs are often wrong.</span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-x" />
                  </span>
                  <span>Debugging AI generated code often takes time.</span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-x" />
                  </span>
                  <span>Not sure when to use AI vs Do it myself.</span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-x" />
                  </span>
                  <span>Worry about over dependence.</span>
                </li>
              </ul>
            </article>

            <article className="insight-panel insight-panel--scaler">
              <div className="insight-panel-head">
                <div className="insight-icon" aria-hidden>
                  <img className="insight-logo" src={publicAsset("/Scaler-Logo_White-3.png")} alt="" />
                </div>
                <h3>
                  How <span className="brand-accent">Scaler</span> empowers you for AI era?
                </h3>
              </div>
              <ul className="insight-list">
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-check" />
                  </span>
                  <span>
                    Understand how to prompt, set up evals, use RAG/context correctly, and add guardrails so
                    AI does not hallucinate.
                  </span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-check" />
                  </span>
                  <span>
                    Use AI to validate AI-generated code: LLM-as-a-judge, hidden test cases, second-model
                    review, quick tests for deterministic outputs, plus monitoring and logging to spot
                    errors early.
                  </span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-check" />
                  </span>
                  <span>
                    Use AI for speed in repeatable work, while your own reasoning leads architecture and
                    system design.
                  </span>
                </li>
                <li>
                  <span className="insight-bullet" aria-hidden>
                    <i className="ph ph-check" />
                  </span>
                  <span>
                    In an AI-first world, foundations matter more than ever. <strong>Scaler</strong> builds
                    strong engineering principles alongside practical AI application, so you&apos;re not
                    just keeping up, but staying ahead.
                  </span>
                </li>
              </ul>
            </article>
          </section>

          <div className="letter-stack letter-stack--mission-close">
            <h3 className="letter-subtitle">
              The shift in front of you is not about AI replacing roles. It is about roles changing shape.
            </h3>
            <p>
              AI is becoming a new layer of leverage, and the people who learn to use it will stay
              relevant. They will be the ones who can identify real problems, build quickly, and ship
              solutions rapidly, all on top of <strong>strong technical foundations</strong>.
            </p>
            <p>
              That is where <strong>Scaler</strong> comes in. We did not add an AI module. We rebuilt
              everything. Learning once is not enough anymore. Scaler gives you the pole position in AI
              today and keeps you there for the next decade with updated curriculum and lifelong access.
              You are not buying a snapshot of 2025. You are buying a living system that updates as the
              market moves.
            </p>
            <p>
              It is where you learn how to use AI with judgment, while deepening thinking, problem solving,
              and long-term technical depth, so you do not just prepare for your next job, you build
              relevance for every job that comes after it.
            </p>
          </div>
        </section>

        <div className="cta-row letter-cta-row">
          <p className="status-line">
            <i className="ph ph-sparkle" aria-hidden />
            Your 12-month roadmap is ready next
          </p>
          <div className="cta-actions">
            <button
              className="button"
              type="button"
              data-track-id="letter_continue_to_roadmap"
              onClick={onContinue}
              disabled={continueDisabled}
            >
              {continueDisabled ? "Loading…" : "View your 12-month roadmap"}{" "}
              {!continueDisabled ? <i className="ph ph-arrow-right" aria-hidden /> : null}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
