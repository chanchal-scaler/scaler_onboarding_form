import { useEffect, useRef, useState } from "react";
import { publicAsset } from "../utils/publicAsset";

const communityCarouselSlides = [
  { src: "/assets/roadmap/community.jpeg", alt: "Community event highlight 1" },
  { src: "/assets/roadmap/community-2.jpg", alt: "Community event highlight 2" },
  { src: "/assets/roadmap/community-3.jpeg", alt: "Community event highlight 3" },
  { src: "/assets/roadmap/community-4.jpeg", alt: "Community event highlight 4" },
  { src: "/assets/roadmap/community-5.jpeg", alt: "Community event highlight 5" },
  { src: "/assets/roadmap/community-6.jpeg", alt: "Community event highlight 6" },
];

/** Synced with pipInstallish/Ftue_final roadmap.html (main timeline content). */
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
    copy:
      "Learners who lock in mentors in Week 1 are 2-3× more likely to get roadmap clarity and hit milestones faster. Top mentor's slots are filling quickly — pick yours now.",
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
    chips: [{ label: "24x7 AI companion" }, { label: "AI lab sessions" }],
    side: "left",
    expandable: true,
    image: "/assets/roadmap/3rd-milestone-new.png",
    imageTag: "Class experience preview",
    expandTitle: "First class",
  },
  {
    id: "month-1-start",
    time: "Month 1",
    title: "Start solving problems",
    copy:
      "Top performers don't get lucky — they get obsessively consistent. Your live dashboard shows exactly where you stand vs your cohort. Build your performance streak before it builds the gap.",
    side: "right",
    expandable: false,
  },
  {
    id: "month-2-resume",
    time: "Month 2",
    title: "Build your resume",
    copy:
      "99.7% of ATS recruiters use keywords to search, making more than 75% of resumes invisible. Build your resume on Career Hub with AI-optimized, battle-tested templates reviewed by industry experts who've hired at top companies.",
    side: "left",
    expandable: false,
  },
  {
    id: "month-1-community",
    time: "Month 1",
    title: "Join community events",
    copy:
      "Referrals. Inside intel. Real talk from engineers already inside top companies. Your city community is where careers quietly get made — but only if you show up.",
    side: "right",
    expandable: true,
    image: "/assets/roadmap/community.jpeg",
    imageTag: "Community event preview",
    expandTitle: "Join community events",
    carouselSlides: communityCarouselSlides,
    carouselCaption: "Community event gallery",
  },
  {
    id: "month-3-mock",
    time: "Month 3",
    title: "Attempt AI mock interviews",
    copy:
      "Practice until a Google L5 loop feels routine. AI feedback in real time. Optional human panels with actual FAANG engineers. Go again, and again.",
    side: "left",
    expandable: false,
  },
  {
    id: "month-5-mentor",
    time: "Month 5",
    title: "Mentor check-in",
    copy: "Review progress and help resolve any concerns or feedback regarding your course.",
    side: "right",
    expandable: false,
  },
  {
    id: "month-7-track",
    time: "Month 7",
    title: "Choose a specialisation track",
    copy: "Choose between multiple Industry vetted specialisation tracks.",
    side: "left",
    expandable: false,
  },
  {
    id: "month-8-mentor",
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
    copy:
      "Use learnings for a practical project. Production-grade systems that look like real engineering work on your resume.",
    side: "left",
    expandable: false,
    chips: [{ label: "AI literacy" }],
  },
  {
    id: "month-10-congrats",
    time: "Month 10",
    title: "Congrats, now you are industry ready!",
    copy: "Clear skill certifications and be eligible to apply for all the roles.",
    side: "right",
    expandable: false,
    chips: [
      { label: "AI infused UI engineer", variant: "ai" },
      { label: "AI augmented SWE", variant: "ai" },
      { label: "Multi-modal AI engineer", variant: "ai" },
      { label: "AI architect", variant: "ai" },
      { label: "Decision scientist", variant: "ai" },
      { label: "AI analyst", variant: "ai" },
      { label: "AI Platform Engineer", variant: "ai" },
      { label: "Agentic Workflow Designer", variant: "ai" },
      { label: "GPU Infrastructure Specialist", variant: "ai" },
      { label: "Semantic Knowledge Engineer", variant: "ai" },
      { label: "ML systems engineer", variant: "ai" },
      { label: "Forward deployed engineer", variant: "ai" },
      { label: "Senior SWE" },
    ],
  },
  {
    id: "month-10-placement",
    time: "Month 10",
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
    id: "month-11-electives",
    time: "Month 11",
    title: "Additional AI electives",
    copy:
      "Eligible for GenAI, Product management with AI etc. (Please check your brochures for all updated electives for your programme)",
    side: "right",
    expandable: false,
  },
  {
    id: "beyond-y1",
    time: "Beyond year 1",
    title: "Your Life long learning partner",
    copy:
      "You will have lifetime access to live and existing course material where we are keeping you updated with latest advancements in tech, so your learning continues.",
    side: "left",
    expandable: false,
  },
];

/** Viewport anchor (fraction from top) used to pick which step is "current" while scrolling */
const ROADMAP_VIEWPORT_ANCHOR = 0.42;

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

export function TimelineScreen({ primaryCtaText = "Start this journey" }) {
  const [openId, setOpenId] = useState(null);
  const [activeScrollId, setActiveScrollId] = useState(milestones[0].id);
  const stepRefs = useRef([]);

  useEffect(() => {
    const updateActiveFromScroll = () => {
      const steps = stepRefs.current.filter(Boolean);
      if (steps.length === 0) return;
      const anchorY = window.innerHeight * ROADMAP_VIEWPORT_ANCHOR;
      let bestEl = null;
      let bestDist = Infinity;
      for (const el of steps) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const midY = r.top + r.height / 2;
        const d = Math.abs(midY - anchorY);
        if (d < bestDist) {
          bestDist = d;
          bestEl = el;
        }
      }
      if (!bestEl) return;
      const id = bestEl.getAttribute("data-milestone-id");
      if (id) setActiveScrollId((prev) => (prev === id ? prev : id));
    };

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

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
          <div className="eyebrow">Your 12-month roadmap to</div>
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
                (milestone.expandable && openId === milestone.id) ||
                (openId === null && activeScrollId === milestone.id);

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
                  <h2 className="roadmap-title">{milestone.title}</h2>
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
                      <h3 className="roadmap-expand-title">{milestone.expandTitle || milestone.title}</h3>
                      <div className="roadmap-expand-gallery">
                        {milestone.carouselSlides?.length ? (
                          <div className="roadmap-community-carousel">
                            <div className="roadmap-community-carousel-viewport">
                              <div className="roadmap-community-carousel-track">
                                {[...milestone.carouselSlides, ...milestone.carouselSlides].map(
                                  (slide, slideIndex) => (
                                    <div
                                      className="roadmap-community-slide"
                                      key={`${milestone.id}-${slide.src}-${slideIndex}`}
                                    >
                                      <img
                                        src={publicAsset(slide.src)}
                                        alt={slide.alt}
                                        className="roadmap-community-slide-image"
                                        loading="lazy"
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                            <p className="roadmap-community-carousel-caption">
                              {milestone.carouselCaption}
                            </p>
                          </div>
                        ) : (
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
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;

              return (
                <article
                  key={milestone.id}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  data-milestone-id={milestone.id}
                  data-track-id={milestone.expandable ? `roadmap_milestone_toggle_${milestone.id}` : undefined}
                  className={`roadmap-step ${milestone.side} ${milestone.expandable ? "roadmap-step--expandable" : "roadmap-step--static"} ${isOpen ? "is-open" : ""}`}
                  data-expandable={milestone.expandable ? "true" : undefined}
                  role={milestone.expandable ? "button" : undefined}
                  tabIndex={milestone.expandable ? 0 : undefined}
                  aria-expanded={milestone.expandable ? isOpen : undefined}
                  onClick={milestone.expandable ? () => toggleStep(milestone.id) : undefined}
                  onKeyDown={milestone.expandable ? (e) => onKeyToggle(e, milestone.id) : undefined}
                >
                  {/* Always node then card so mobile 2-col grid places marker + card on one row (left used to be card+node and broke alignment). */}
                  {center}
                  {content}
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
          data-track-id="roadmap_primary_cta_external"
          href={import.meta.env.VITE_ROADMAP_JOURNEY_URL || "https://www.scaler.com"}
          target="_blank"
          rel="noreferrer"
        >
          {primaryCtaText} <i className="ph ph-arrow-right" aria-hidden />
        </a>
      </div>
    </section>
  );
}
