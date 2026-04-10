export function getDefaultValues(fields, allValues) {
  return fields.reduce((acc, field) => {
    acc[field.id] = allValues[field.id] ?? (field.type === "multicheck" ? [] : "");
    return acc;
  }, {});
}

function serializeResponseValue(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .map((item) => serializeResponseValue(item))
      .join(",");
  }
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (value == null) return "";
  return String(value);
}

export function buildPayload(formGroupLabel, allValues, stepValues) {
  const merged = { ...allValues, ...stepValues };
  const serializedResponses = Object.fromEntries(
    Object.entries(merged).map(([key, value]) => [String(key), serializeResponseValue(value)]),
  );

  return {
    form_group_label: formGroupLabel,
    form_responses: serializedResponses,
    auto_save: false,
  };
}
