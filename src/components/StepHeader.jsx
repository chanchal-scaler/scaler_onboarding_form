export function StepHeader({ currentStep, totalSteps, onBack, stepName }) {
  const progress = totalSteps > 0 ? `${Math.round(((currentStep + 1) / totalSteps) * 100)}%` : "0%";
  const stepLabel = currentStep === totalSteps - 1 ? "Final" : `Step ${currentStep + 1}`;
  const countLabel = `${String(currentStep + 1).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`;
  const fallbackTitles = [
    "Your profile details",
    "Work and education",
    "Programming readiness",
    "Experience with AI",
    "Mission and onboarding letter",
  ];
  const headerTitle = stepName?.trim() || fallbackTitles[currentStep] || "Onboarding form";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="back-link" type="button" onClick={onBack} aria-label="Go back">
          <i className="ph ph-arrow-left" aria-hidden />
        </button>
        <div className="step-meta">
          <div className="step-overline">{stepLabel}</div>
          <div className="step-title">{headerTitle}</div>
        </div>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ "--progress": progress }} aria-hidden="true">
          <span />
        </div>
        <div className="progress-label">{countLabel}</div>
      </div>
    </header>
  );
}
