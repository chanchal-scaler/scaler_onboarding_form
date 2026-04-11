import { DEFAULT_EXPECTATION_COURSE_KEY } from "./constants";

/**
 * Expectation-form identifiers from `/academy/mentee-dashboard/initial-load-data/`.
 * Slug matches mentee TodoFormActionCard: `user_data.current_user.slug`.
 * Course / utm: optional backend fields (snake_case); course falls back to academy v2.
 */
export function getExpectationParamsFromInitialLoad(initialLoadData) {
  const userData = initialLoadData?.user_data;
  const currentUser = userData?.current_user;

  const slug = currentUser?.slug;
  const course = userData?.course_name;
  const utmSource = 'ftue_v3_form';

  return { slug, course, utmSource };
}
