import "./App.css";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StepHeader } from "./components/StepHeader";
import { StepForm } from "./components/StepForm";
import { DebugPanel } from "./components/DebugPanel";
import { StateScreen } from "./components/StateScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { FinalLetterScreen } from "./components/FinalLetterScreen";
import { TimelineScreen } from "./components/TimelineScreen";
import { ExpectationSettingScreen } from "./components/ExpectationSettingScreen";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingForm } from "./hooks/useOnboardingForm";
import { isAuthError } from "./authError";
import { fetchExpectationFormDetail } from "./api/expectationForm";
import { oneTimeFetchOptions } from "./constants/queryOptions";

function App() {
  const {
    user,
    screens,
    formGroupLabel,
    timelineFloatingCta,
    initialShowTimeline,
    isLoading,
    error,
    expectationSlug,
    expectationCourse,
    expectationUtm,
  } = useOnboardingData();
  const onboarding = useOnboardingForm({ screens, formGroupLabel });
  const [phase, setPhase] = useState("home");

  /** Full-screen phases share one document scroll; reset when switching so letter/timeline don’t inherit form scroll. */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [phase]);

  const expectationQuery = useQuery({
    queryKey: ["expectation-form", expectationSlug, expectationCourse],
    queryFn: () => fetchExpectationFormDetail(expectationSlug, expectationCourse),
    enabled: Boolean(expectationSlug),
    ...oneTimeFetchOptions,
  });

  /** After the last form step: expectation (if required) → letter → timeline */
  useEffect(() => {
    if (!onboarding.isCompleted) return;
    if (!expectationSlug) {
      setPhase("letter");
      return;
    }
    if (expectationQuery.isLoading || expectationQuery.isFetching) return;
    if (expectationQuery.isError) {
      setPhase("letter");
      return;
    }
    if (expectationQuery.data?.form_filled) {
      setPhase("letter");
    } else {
      setPhase("expectation");
    }
  }, [
    onboarding.isCompleted,
    expectationSlug,
    expectationQuery.isLoading,
    expectationQuery.isFetching,
    expectationQuery.isError,
    expectationQuery.data?.form_filled,
  ]);

  useEffect(() => {
    if (isLoading) return;
    if (initialShowTimeline) setPhase("timeline");
  }, [isLoading, initialShowTimeline]);

  useEffect(() => {
    if (phase !== "expectation") return;
    if (!expectationSlug) setPhase("letter");
  }, [phase, expectationSlug]);

  useEffect(() => {
    if (phase !== "expectation" || !expectationSlug) return;
    if (expectationQuery.data?.form_filled) setPhase("letter");
  }, [phase, expectationSlug, expectationQuery.data?.form_filled]);

  const handleLetterContinue = useCallback(() => {
    setPhase("timeline");
  }, []);

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

  /** Last step submitted: wait for expectation-form detail before leaving the form step */
  const awaitingExpectationBranch =
    onboarding.isCompleted &&
    Boolean(expectationSlug) &&
    (expectationQuery.isLoading || expectationQuery.isFetching) &&
    phase === "form";

  if (awaitingExpectationBranch) {
    return <LoadingScreen />;
  }

  if (phase === "home") {
    return <HomeScreen onStart={() => setPhase("form")} />;
  }

  if (phase === "letter") {
    return (
      <FinalLetterScreen
        user={user}
        allValues={onboarding.allValues}
        onContinue={handleLetterContinue}
        continueDisabled={false}
      />
    );
  }

  if (phase === "expectation") {
    if (expectationQuery.isLoading || expectationQuery.isFetching) {
      return <LoadingScreen />;
    }
    if (expectationQuery.isError) {
      return (
        <StateScreen
          title="Could not load enrolment agreement"
          message={String(expectationQuery.error?.message || expectationQuery.error)}
        />
      );
    }
    return (
      <ExpectationSettingScreen
        detail={expectationQuery.data}
        user={user}
        slug={expectationSlug}
        course={expectationCourse}
        utmSource={expectationUtm}
        onBack={() => setPhase("form")}
        onContinueToLetter={() => setPhase("letter")}
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
