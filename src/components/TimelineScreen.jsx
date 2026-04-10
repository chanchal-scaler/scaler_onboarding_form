import { useState } from "react";
import { publicAsset } from "../utils/publicAsset";

const ROADMAP_EMAIL_HREF =
  "mailto:?subject=My%2012-Month%20Scaler%20Roadmap&body=Hi,%0D%0A%0D%0AHere%20is%20my%20Scaler%2012-month%20roadmap.%0D%0A";

/** Aligned with pipInstallish/Ftue_final roadmap.html */
const milestones = [
  {
    id: "day-0",
    time: "Day 0",
    title: "Meet and Greet session",
    copy:
      "Orientation session, features including your 24 x 7 AI companion and clarity on what the year will demand from you.",
    side: "left",
    expandable: true,
    image: "/assets/roadmap/1st-milestone.png",
    imageTag: "Meet & Greet preview",
    expandTitle: "Meet and Greet Session",
  },
  {
    id: "day-1",
    time: "Day 1",
    title: "First mentor session",
    copy: "Plan your Scaler journey with an industry veteran of your choice.",
    side: "right",
    expandable: true,
    image: "/assets/roadmap/2nd-milestone.png",
    imageTag: "Mentor and dashboard preview",
    expandTitle: "Select a mentor from a pool of Industry veterans and plan your scaler journey",
  },
  {
    id: "day-2",
    time: "Day 2",
    title: "First class",
    copyNode: (
      <>
        We didn&apos;t add an AI module. We rebuilt everything. Learn from the <strong>top 1%</strong> in
        AI. 24x7 <strong>AI companion</strong> for any support.
      </>
    ),
    side: "left",
    expandable: true,
    image: "/assets/roadmap/3rd-milestone-new.png",
    imageTag: "Class experience preview",
    expandTitle: "First class",
  },
  {
    id: "month-1",
    time: "Month 1",
    title: "Mentor check-in",
    copy: "Review progress and help resolve any concerns or feedback regarding your course.",
    side: "right",
    expandable: false,
  },
  {
    id: "month-3",
    time: "Month 3",
    title: "Placement assistance begins",
    copy:
      "Clear skill certification rounds at end of core modules and start applying to jobs from over 900+ hiring partners.",
    side: "left",
    expandable: true,
    image: "/assets/roadmap/4th-milestone.png",
    imageTag: "Careers Hub preview",
    expandTitle: "Get skills, build your resume and apply to jobs on Careerhub",
  },
  {
    id: "month-5",
    time: "Month 5",
    title: "Mentor check-in",
    copy: "Review progress and help resolve any concerns or feedback regarding your course.",
    side: "right",
    expandable: false,
  },
  {
    id: "month-7",
    time: "Month 7",
    title: "Choose a specialisation track",
    copy: "Choose between these tracks:",
    side: "left",
    expandable: false,
    chips: [
      { label: "Backend" },
      { label: "Fullstack" },
      { label: "Data engineering" },
    ],
  },
  {
    id: "month-8",
    time: "Month 8",
    title: "Mentor check-in",
    copy: "Review progress and help resolve any concerns or feedback regarding your course.",
    side: "right",
    expandable: false,
  },
  {
    id: "month-10-portfolio",
    time: "Month 10",
    title: "Real world portfolio project",
    copy: "Use learnings for a practical project.",
    side: "left",
    expandable: false,
    chips: [{ label: "AI literacy" }, { label: "HLD" }, { label: "LLD" }, { label: "Front end" }],
  },
  {
    id: "month-10-ready",
    time: "Month 10",
    title: "Congrats, now you are industry ready!",
    copy: "Clear skill certifications and be eligible to apply for all the roles.",
    side: "right",
    expandable: false,
    chips: [
      { label: "AI infused UI engineer", variant: "ai" },
      { label: "AI augmented SWE", variant: "ai" },
      { label: "Multi-modal AI engineer", variant: "ai" },
      { label: "Agent engineer", variant: "ai" },
      { label: "AI architect", variant: "ai" },
      { label: "Forward deployed engineer" },
      { label: "Senior SWE" },
    ],
  },
  {
    id: "month-11",
    time: "Month 11",
    title: "Additional AI electives",
    copy: "Eligible for GenAI, Product management with AI etc.",
    side: "left",
    expandable: false,
    chips: [{ label: "GenAI", variant: "ai" }, { label: "Product management with AI", variant: "ai" }],
  },
  {
    id: "beyond-y1",
    time: "Beyond year 1",
    title: "Your Life long learning partner",
    copy:
      "You will have lifetime access to live and existing course material where we are keeping you updated with latest advancements in tech, so your learning continues.",
    side: "right",
    expandable: false,
  },
];

function RoadmapOneLiner({ children }) {
  return <p className="roadmap-one-liner">{children}</p>;
}

function RoadmapChips({ chips }) {
  if (!chips?.length) return null;
  return (
    <div className="roadmap-chips">
      {chips.map((c) => (
        <span
          key={c.label}
          className={`roadmap-chip ${c.variant === "ai" ? "roadmap-chip--ai-role" : ""}`}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

export function TimelineScreen({
  primaryCtaText = "Start this journey",
  secondaryCtaText = "Questions? Request a callback",
}) {
  const [openId, setOpenId] = useState(null);

  const toggleStep = (id) => {
    const step = milestones.find((m) => m.id === id);
    if (!step?.expandable) return;
    setOpenId((prev) => (prev === id ? null : id));
  };

  const onKeyToggle = (event, id) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleStep(id);
  };

  return (
    <section className="screen default-screen timeline-screen">
      <main className="shell">
        <header className="hero">
          <p className="eyebrow">Your 12-month roadmap to</p>
          <h1 className="headline">Learning and Building, with and from, AI.</h1>
          <p className="subcopy">
            TL;DR: Meet and greet orientation session, foundational modules, core modules, choose a
            specialization, placements, and mentor check-ins all along the way.
          </p>
        </header>
        <div className="roadmap-layout">
          <section className="timeline roadmap-timeline" id="timeline-start">
            {milestones.map((milestone, index) => {
              const isOpen = milestone.expandable && openId === milestone.id;
              const nodeActive =
                (milestone.expandable && openId === milestone.id) || (openId === null && index === 0);

              const body = (
                <>
                  {milestone.copyNode ? (
                    <RoadmapOneLiner>{milestone.copyNode}</RoadmapOneLiner>
                  ) : (
                    <RoadmapOneLiner>{milestone.copy}</RoadmapOneLiner>
                  )}
                  <RoadmapChips chips={milestone.chips} />
                </>
              );

              const content = (
                <div className={`roadmap-content roadmap-content--${milestone.side}`}>
                  <div className="roadmap-time">{milestone.time}</div>
                  <h3 className="roadmap-title">{milestone.title}</h3>
                  {body}
                </div>
              );

              const center = (
                <div className="roadmap-center">
                  <div className={`roadmap-node ${nodeActive ? "roadmap-node--active" : ""}`} aria-hidden />
                </div>
              );

              const expandPanel =
                milestone.expandable && milestone.image ? (
                  <div className="roadmap-expand-panel">
                    <div className="roadmap-expand-shell">
                      <p className="roadmap-expand-label">Milestone walkthrough</p>
                      <h4 className="roadmap-expand-title">{milestone.expandTitle || milestone.title}</h4>
                      <div className="roadmap-expand-gallery">
                        <div className="roadmap-placeholder roadmap-placeholder--image">
                          <img
                            src={publicAsset(milestone.image)}
                            alt={milestone.title}
                            className="roadmap-expand-image"
                          />
                          {milestone.imageTag ? (
                            <span className="roadmap-image-tag">{milestone.imageTag}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;

              return (
                <article
                  key={milestone.id}
                  className={`roadmap-step ${milestone.side} ${milestone.expandable ? "roadmap-step--expandable" : "roadmap-step--static"} ${isOpen ? "is-open" : ""}`}
                  data-expandable={milestone.expandable ? "true" : undefined}
                  role={milestone.expandable ? "button" : undefined}
                  tabIndex={milestone.expandable ? 0 : undefined}
                  aria-expanded={milestone.expandable ? isOpen : undefined}
                  onClick={milestone.expandable ? () => toggleStep(milestone.id) : undefined}
                  onKeyDown={milestone.expandable ? (e) => onKeyToggle(e, milestone.id) : undefined}
                >
                  {milestone.side === "left" ? (
                    <>
                      {content}
                      {center}
                    </>
                  ) : (
                    <>
                      {center}
                      {content}
                    </>
                  )}
                  {expandPanel}
                </article>
              );
            })}
          </section>
        </div>
      </main>
      <div className="floating-actions" role="region" aria-label="Roadmap actions">
        <a
          className="roadmap-float-btn roadmap-float-btn--primary"
          href={import.meta.env.VITE_ROADMAP_JOURNEY_URL || "https://www.scaler.com"}
          target="_blank"
          rel="noreferrer"
        >
          {primaryCtaText} <i className="ph ph-arrow-right" aria-hidden />
        </a>
        {/* <a className="roadmap-float-btn roadmap-float-btn--secondary" href={ROADMAP_EMAIL_HREF}>
          {secondaryCtaText}
        </a> */}
      </div>
    </section>
  );
}
