import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { submitOnboardingForm } from "../api";
import { buildPayload, getDefaultValues } from "../utils/formValues";

export function useOnboardingForm({ screens, formGroupLabel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [allValues, setAllValues] = useState({});
  const [submitResponse, setSubmitResponse] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const currentScreen = screens[currentStep] || null;
  const form = useForm({ mode: "onSubmit", defaultValues: {} });
  const { handleSubmit, reset, getValues } = form;

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
    const payload = buildPayload(formGroupLabel, allValues, stepValues, screens);
    const finalValues = { ...allValues, ...stepValues };
    setAllValues(finalValues);
    await submitMutation.mutateAsync(payload);
    setIsCompleted(true);
  });

  const onBack = () => {
    if (currentStep === 0) return;
    saveStep(getValues(), -1);
  };

  return {
    form,
    currentStep,
    currentScreen,
    allValues,
    submitResponse,
    isCompleted,
    submitMutation,
    onNext,
    onBack,
  };
}
