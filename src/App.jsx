import "./App.css";
import { StepHeader } from "./components/StepHeader";
import { StepForm } from "./components/StepForm";
import { DebugPanel } from "./components/DebugPanel";
import { StateScreen } from "./components/StateScreen";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingForm } from "./hooks/useOnboardingForm";
import { isAuthError } from "./authError";

function App() {
  const { user, screens, formGroupLabel, isLoading, error } = useOnboardingData();
  const onboarding = useOnboardingForm({ screens, formGroupLabel });

  if (isLoading) return <StateScreen title="Loading onboarding data..." message="Please wait." />;
  if (isAuthError(error)) {
    return (
      <StateScreen
        title="Session expired"
        message="Please log in on Scaler in the same browser, then refresh this page."
      />
    );
  }
  if (error) return <StateScreen title="Failed to load data" message={String(error)} />;
  if (!onboarding.currentScreen) {
    return <StateScreen title="No form sections found" message="Could not detect any sections/forms in the form-group response." />;
  }

  return (
    <div className="page">
      <StepHeader user={user} currentStep={onboarding.currentStep} totalSteps={screens.length} />
      <StepForm
        screen={onboarding.currentScreen}
        formState={onboarding.form.formState}
        register={onboarding.form.register}
        onNext={onboarding.onNext}
        onBack={onboarding.onBack}
        currentStep={onboarding.currentStep}
        totalSteps={screens.length}
        isSubmitting={onboarding.submitMutation.isPending}
        submitError={
          onboarding.finalSubmitError ||
          (onboarding.submitMutation.isError ? onboarding.submitMutation.error : null)
        }
        isSubmitted={onboarding.submitMutation.isSuccess}
      />
      <DebugPanel
        formGroupLabel={formGroupLabel}
        allValues={onboarding.allValues}
        submitResponse={onboarding.submitResponse}
      />
    </div>
  );
}

export default App;
