import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInitialLoadData, fetchOnboardingFormGroup } from "../api";
import { normalizeFormGroup } from "../formSchema";
import { oneTimeFetchOptions } from "../constants/queryOptions";

export function useOnboardingData() {
  const initialQuery = useQuery({
    queryKey: ["initial-load-data"],
    queryFn: fetchInitialLoadData,
    ...oneTimeFetchOptions,
  });

  const formGroupQuery = useQuery({
    queryKey: ["onboarding-form-group"],
    queryFn: fetchOnboardingFormGroup,
    ...oneTimeFetchOptions,
  });

  const normalized = useMemo(
    () => normalizeFormGroup(formGroupQuery.data || {}),
    [formGroupQuery.data],
  );

  return {
    user: initialQuery.data?.user_data?.current_user,
    screens: normalized.screens,
    formGroupLabel: normalized.formGroupLabel,
    isLoading: initialQuery.isLoading || formGroupQuery.isLoading,
    error: initialQuery.error || formGroupQuery.error,
  };
}
