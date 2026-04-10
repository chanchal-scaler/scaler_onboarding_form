export function getDefaultValues(fields, allValues) {
  return fields.reduce((acc, field) => {
    acc[field.id] = allValues[field.id] ?? (field.type === "multicheck" ? [] : "");
    return acc;
  }, {});
}

export function buildPayload(formGroupLabel, allValues, stepValues) {
  return {
    form_group_label: formGroupLabel,
    form_responses: { ...allValues, ...stepValues },
    auto_save: false,
  };
}
