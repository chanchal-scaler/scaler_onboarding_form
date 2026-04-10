import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { submitOnboardingForm, trackOnboardingCompleted } from "../api";
import { buildPayload, getDefaultValues } from "../utils/formValues";

export function useOnboardingForm({ screens, formGroupLabel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [allValues, setAllValues] = useState({});
  const [submitResponse, setSubmitResponse] = useState(null);
  const [finalSubmitError, setFinalSubmitError] = useState(null);
  const currentScreen = screens[currentStep] || null;
  const form = useForm({ mode: "onSubmit", defaultValues: {} });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!currentScreen) return;
    reset(getDefaultValues(currentScreen.fields, allValues));
  }, [currentScreen, allValues, reset]);

  const submitMutation = useMutation({
    mutationFn: submitOnboardingForm,
    onSuccess: setSubmitResponse,
  });

  const saveStep = (stepValues, stepDiff) => {
    setAllValues((prev) => ({ ...prev, ...stepValues }));
    setCurrentStep((prev) => prev + stepDiff);
  };

  const onNext = handleSubmit(async (stepValues) => {
    if (currentStep < screens.length - 1) return saveStep(stepValues, 1);
    setFinalSubmitError(null);
    const payload = buildPayload(formGroupLabel, allValues, stepValues);

    try {
      await submitMutation.mutateAsync(payload);
    } catch {
      // Submission failure is non-blocking for completion tracking and redirect.
    }

    try {
      await trackOnboardingCompleted();
      window.location.assign("https://scaler.com");
    } catch (error) {
      setFinalSubmitError(error);
    }
  });

  const onBack = handleSubmit((stepValues) => {
    if (currentStep === 0) return;
    saveStep(stepValues, -1);
  });

  return {
    form,
    currentStep,
    currentScreen,
    allValues,
    submitResponse,
    finalSubmitError,
    submitMutation,
    onNext,
    onBack,
  };
}
