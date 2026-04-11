import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInitialLoadWithCompletionDecision, fetchOnboardingFormGroup } from "../api";
import { normalizeFormGroup, getTimelineFloatingLabels } from "../formSchema";
import { oneTimeFetchOptions } from "../constants/queryOptions";
import { getExpectationParamsFromInitialLoad } from "../expectationSetting/fromInitialLoad";

export function useOnboardingData() {
  const initialQuery = useQuery({
    queryKey: ["initial-load-and-tracking"],
    queryFn: fetchInitialLoadWithCompletionDecision,
    ...oneTimeFetchOptions,
  });

  const courseSlug = initialQuery.data?.initialLoadData?.user_data?.course_slug;

  const formGroupQuery = useQuery({
    queryKey: ["onboarding-form-group", courseSlug ?? "default"],
    queryFn: () => fetchOnboardingFormGroup(courseSlug),
    enabled: initialQuery.isSuccess,
    ...oneTimeFetchOptions,
  });

  const normalized = useMemo(
    () => normalizeFormGroup(formGroupQuery.data || {}),
    [formGroupQuery.data],
  );

  const timelineFloatingCta = useMemo(
    () => getTimelineFloatingLabels(normalized.screens, normalized.formGroupMeta),
    [normalized.screens, normalized.formGroupMeta],
  );

  const initialLoadData = initialQuery.data?.initialLoadData;

  const expectationParams = useMemo(
    () => getExpectationParamsFromInitialLoad(initialLoadData),
    [initialLoadData],
  );

  return {
    user: initialLoadData?.user_data?.current_user,
    /** For `/api/v3/expectation-form` (slug/course/utm from initial-load `user_data`). */
    expectationSlug: expectationParams.slug,
    expectationCourse: expectationParams.course,
    expectationUtm: expectationParams.utmSource,
    /** True when `/api/v3/action-trackings/mentee_completed_onboarding` returned a completed record (decided with initial load only). */
    initialShowTimeline: initialQuery.data?.initialShowTimeline ?? false,
    screens: normalized.screens,
    formGroupLabel: normalized.formGroupLabel,
    formGroupMeta: normalized.formGroupMeta,
    timelineFloatingCta,
    isLoading: initialQuery.isLoading || formGroupQuery.isLoading,
    error: initialQuery.error || formGroupQuery.error,
  };
}
