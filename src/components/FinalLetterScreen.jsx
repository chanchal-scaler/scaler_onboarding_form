import { publicAsset } from "../utils/publicAsset";

const alumni = [
  {
    name: "Mayank Chauhan",
    role: "SDE 2 at CYware",
    before: "Fresher",
    company: "CYware",
    href: "https://www.linkedin.com/posts/mayank6_iamscaler-coding-programmers-activity-6878628380611248128-D0QY/",
    photo: "/assets/alumni/mayank-chauhan.jpeg",
    logo: "/assets/alumni/logos/cyware.png",
  },
  {
    name: "Saurabh Singh",
    role: "SDE - Full Stack @ Lido",
    before: "Fresher",
    company: "Lido",
    href: "https://www.linkedin.com/in/-saurabh--singh/?originalSubdomain=in",
    photo: "/assets/alumni/saurabh-singh.jpeg",
    logo: "/assets/alumni/logos/lido.jpeg",
  },
  {
    name: "Siddharth Aadarsh",
    role: "Backend Developer @ HealthifyMe",
    before: "Fresher",
    company: "HealthifyMe",
    href: "https://www.linkedin.com/posts/siddharth-aadarsh_scaler-healthifyme-licious-activity-6873682154916855808-fX6J/",
    photo: "/assets/alumni/siddharth-aadarsh.jpeg",
    logo: "/assets/alumni/logos/healthifyme.png",
  },
];

const EMAIL_LETTER_HREF =
  "mailto:?subject=My%20Scaler%20Onboarding%20Letter&body=Hi,%0D%0A%0D%0AHere%20is%20my%20Scaler%20onboarding%20letter.%0D%0A";

export function FinalLetterScreen({ user, allValues, onContinue }) {
  const userName = user?.name || "Learner";
  const experience = allValues?.total_experience || "3.4 years";
  const target = allValues?.goal || allValues?.career_goal || "a stronger backend role";

  return (
    <section className="screen default-screen shell page letter-screen">
      <div className="letter-frame letter-page">
        <p className="eyebrow letter-eyebrow">Welcome note</p>
        <h1 className="headline">
          {userName}, your journey to staying relevant, starts now.{" "}
          (50+ learners with similar profiles are also starting this journey with you)
        </h1>
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

        <section className="letter-card">
          <div className="letter-stack">
            <p>
              You are a <strong>software engineer with {experience} of experience</strong>, and you are
              here because you want to switch into {target}, crack SDE interviews, and learn how to use AI
              effectively without relying on it.
            </p>
            <p>
              Right now, your profile reads like someone with comfortable programming fundamentals,
              working SQL confidence, and a base in DSA that can go further, while your AI readiness
              already shows regular usage but a clear blocker around{" "}
              <strong>debugging AI-generated code without losing your own judgment</strong>.
            </p>
            <p>
              The first phase will not feel like random content consumption. It will feel like{" "}
              <strong>structured pressure in the right places</strong>: better backend thinking, sharper
              debugging habits, more deliberate problem solving, and earlier clarity on when AI should
              speed you up versus when it should be challenged.
            </p>
            <p>
              If your goal is to switch into backend with stronger outcomes, then{" "}
              <strong>consistency has to become part of your identity</strong>. Backend roles reward
              people who can think clearly, debug independently, and use leverage well without outsourcing
              judgment.
            </p>
          </div>
        </section>

        <section className="insight-grid">
          <article className="insight-card">
            <h3>What surprised us about your profile</h3>
            <ul>
              <li>
                You are not starting from zero. Your role already gives you enough real-world context to
                make backend depth practical, not abstract.
              </li>
              <li>
                Your motivation around curriculum and mentorship suggests you are not looking for
                inspiration alone. You want structure that leads to outcomes.
              </li>
              <li>
                Your goal is not just job switch. It is a more credible engineering identity in an
                AI-shaped market.
              </li>
            </ul>
          </article>
          <article className="insight-card">
            <h3>What early modules will address for you</h3>
            <ul>
              <li>
                They will help you become more interview-ready for backend engineering roles by tightening
                the problem-solving and systems thinking expected in stronger hiring loops.
              </li>
              <li>
                They will directly help with your blocker around debugging AI-generated code, so AI
                becomes a useful accelerator in your workflow instead of a source of confusion.
              </li>
              <li>
                They will push your current proficiency summary toward stronger execution by helping you
                turn existing programming comfort into more reliable backend decision-making.
              </li>
            </ul>
          </article>
        </section>

        <div className="cta-row letter-cta-row">
          <p className="status-line">
            <i className="ph ph-sparkle" aria-hidden />
            Your 12-month roadmap is ready next
          </p>
          <div className="cta-actions">
            <button className="button" type="button" onClick={onContinue}>
              View your 12-month roadmap <i className="ph ph-arrow-right" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
