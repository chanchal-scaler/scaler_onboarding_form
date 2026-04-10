import "./App.css";
import { useEffect, useState } from "react";
import { StepHeader } from "./components/StepHeader";
import { StepForm } from "./components/StepForm";
import { DebugPanel } from "./components/DebugPanel";
import { StateScreen } from "./components/StateScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { FinalLetterScreen } from "./components/FinalLetterScreen";
import { TimelineScreen } from "./components/TimelineScreen";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingForm } from "./hooks/useOnboardingForm";
import { isAuthError } from "./authError";

function App() {
  const {
    user,
    screens,
    formGroupLabel,
    timelineFloatingCta,
    initialShowTimeline,
    isLoading,
    error,
  } = useOnboardingData();
  const onboarding = useOnboardingForm({ screens, formGroupLabel });
  const [phase, setPhase] = useState("home");

  useEffect(() => {
    if (onboarding.isCompleted) {
      setPhase("letter");
    }
  }, [onboarding.isCompleted]);

  useEffect(() => {
    if (isLoading) return;
    if (initialShowTimeline) setPhase("timeline");
  }, [isLoading, initialShowTimeline]);

  if (isLoading) return <LoadingScreen />;
  if (isAuthError(error)) {
    return (
      <StateScreen
        title="Session expired"
        message="Please log in on Scaler in the same browser, then refresh this page."
      />
    );
  }
  if (error) return <StateScreen title="Failed to load data" message={String(error)} />;

  if (phase === "home") {
    return <HomeScreen onStart={() => setPhase("form")} />;
  }

  if (phase === "letter") {
    return (
      <FinalLetterScreen
        user={user}
        allValues={onboarding.allValues}
        onContinue={() => setPhase("timeline")}
      />
    );
  }

  if (phase === "timeline") {
    return (
      <TimelineScreen
        primaryCtaText={timelineFloatingCta.primary}
        secondaryCtaText={timelineFloatingCta.secondary}
      />
    );
  }

  if (!onboarding.currentScreen) {
    return <StateScreen title="No form sections found" message="Could not detect any sections/forms in the form-group response." />;
  }

  return (
    <section className="screen default-screen">
      <div className="frame form-frame">
        <main className="content form-content">
          <StepHeader
            currentStep={onboarding.currentStep}
            totalSteps={screens.length}
            onBack={() => {
              if (onboarding.currentStep === 0) setPhase("home");
              else onboarding.onBack();
            }}
            stepName={onboarding.currentScreen?.stepName}
          />
          <StepForm
            screen={onboarding.currentScreen}
            formState={onboarding.form.formState}
            register={onboarding.form.register}
            watch={onboarding.form.watch}
            control={onboarding.form.control}
            onNext={onboarding.onNext}
            onBack={onboarding.onBack}
            currentStep={onboarding.currentStep}
            totalSteps={screens.length}
            isSubmitting={onboarding.submitMutation.isPending}
            submitError={onboarding.submitMutation.isError ? onboarding.submitMutation.error : null}
            isSubmitted={onboarding.submitMutation.isSuccess}
          />
          {import.meta.env.VITE_SHOW_DEBUG === "true" && (
            <DebugPanel
              formGroupLabel={formGroupLabel}
              allValues={onboarding.allValues}
              submitResponse={onboarding.submitResponse}
            />
          )}
        </main>
      </div>
    </section>
  );
}

export default App;
