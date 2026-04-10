export function StepHeader({ user, currentStep, totalSteps }) {
  return (
    <header className="header">
      <h1>Scaler Onboarding</h1>
      <p>
        Logged in as <strong>{user?.name || "Unknown user"}</strong> ({user?.email || "No email"})
      </p>
      <p className="progress">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </header>
  );
}
