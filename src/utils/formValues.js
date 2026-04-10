export function otherFieldKey(fieldId) {
  return `${fieldId}__other`;
}

export function getDefaultValues(fields, allValues) {
  return fields.reduce((acc, field) => {
    acc[field.id] = allValues[field.id] ?? (field.type === "multicheck" ? [] : "");
    if (field.type === "multicheck" && field.otherOptionValue != null) {
      acc[otherFieldKey(field.id)] = allValues[otherFieldKey(field.id)] ?? "";
    }
    return acc;
  }, {});
}

function serializeResponseValue(value, valueToLabelMap) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .map((item) => serializeResponseValue(item, valueToLabelMap))
      .join("#");
  }
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (value == null) return "";
  const normalized = String(value);
  if (!valueToLabelMap) return normalized;
  return valueToLabelMap.get(normalized) ?? normalized;
}

function buildFieldOptionMaps(screens = []) {
  const maps = new Map();
  screens.forEach((screen) => {
    (screen.fields || []).forEach((field) => {
      if (!Array.isArray(field.options) || field.options.length === 0) return;
      const valueToLabelMap = new Map();
      field.options.forEach((option) => {
        valueToLabelMap.set(String(option.value), String(option.label));
      });
      maps.set(String(field.id), valueToLabelMap);
    });
  });
  return maps;
}

function collectFieldsById(screens = []) {
  const byId = new Map();
  screens.forEach((screen) => {
    (screen.fields || []).forEach((field) => {
      byId.set(String(field.id), field);
    });
  });
  return byId;
}

/** Replace "Any other" value with free text so `#`-joined payload matches other option labels. */
function applyMulticheckOtherText(merged, fieldsById) {
  const out = { ...merged };
  for (const field of fieldsById.values()) {
    if (field.type !== "multicheck" || field.otherOptionValue == null) continue;
    const id = String(field.id);
    const otherKey = otherFieldKey(id);
    const raw = out[id];
    const otherText = String(out[otherKey] ?? "").trim();
    if (Array.isArray(raw)) {
      out[id] = raw.map((v) =>
        String(v) === String(field.otherOptionValue) && otherText ? otherText : v,
      );
    }
    delete out[otherKey];
  }
  return out;
}

export function buildPayload(formGroupLabel, allValues, stepValues, screens) {
  const merged = { ...allValues, ...stepValues };
  const fieldsById = collectFieldsById(screens);
  const forSerialization = applyMulticheckOtherText(merged, fieldsById);
  const fieldOptionMaps = buildFieldOptionMaps(screens);
  const serializedResponses = Object.fromEntries(
    Object.entries(forSerialization).map(([key, value]) => [
      String(key),
      serializeResponseValue(value, fieldOptionMaps.get(String(key))),
    ]),
  );

  return {
    form_group_label: formGroupLabel,
    form_responses: serializedResponses,
    auto_save: false,
  };
}
