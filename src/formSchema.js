function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toOption(option, index) {
  if (option == null) {
    return null;
  }

  if (typeof option === "string" || typeof option === "number") {
    return { label: String(option), value: option };
  }

  const label =
    option.label ?? option.title ?? option.name ?? option.text ?? `Option ${index + 1}`;
  const value = option.value ?? option.id ?? option.key ?? label;

  return { label: String(label), value };
}

/**
 * interviewbit_form `meta.width` on a 12-column grid (see API payload):
 * - xs: 3 cols — pairs with medium (3 + 9)
 * - small: 6 cols — half row; two `small` fields per line (6 + 6)
 * - medium: 9 cols — pairs with xs (e.g. full name, guardian phone)
 * - long: 12 cols — full row only
 *
 * `small` is not `xs` (xs is narrower than half).
 */
function inferLayoutWidth(field) {
  const meta = field.meta || {};
  const attrs = field.attributes || {};
  const raw =
    field.width ??
    meta.width ??
    field.column_width ??
    meta.column_width ??
    attrs.width ??
    attrs.column_width;

  if (raw == null || raw === "") {
    return { layoutWidth: null, layoutSpan: null };
  }

  const num = Number(raw);
  if (Number.isFinite(num) && num >= 1 && num <= 12) {
    return { layoutWidth: null, layoutSpan: Math.floor(num) };
  }

  const s = String(raw).toLowerCase().trim();

  if (s === "xs" || s === "xsmall" || s === "extra_small" || s === "extra-small") {
    return { layoutWidth: "xs", layoutSpan: null };
  }
  if (s === "small" || s === "sm") {
    return { layoutWidth: "small", layoutSpan: null };
  }
  if (s === "medium" || s === "md" || s === "m") {
    return { layoutWidth: "medium", layoutSpan: null };
  }
  if (s === "long" || s === "full" || s === "wide" || s === "100" || s === "xl") {
    return { layoutWidth: "long", layoutSpan: null };
  }

  /* Legacy / shorthand */
  if (s === "narrow" || s === "s") return { layoutWidth: "xs", layoutSpan: null };
  if (["half", "split", "equal", "50"].includes(s)) return { layoutWidth: "small", layoutSpan: null };
  if (s === "large" || s === "lg") return { layoutWidth: "long", layoutSpan: null };

  return { layoutWidth: null, layoutSpan: null };
}

function inferFieldType(field) {
  const rawType = String(
    field.form_type ||
      field.input_type ||
      field.field_type ||
      field.answer_type ||
      field.response_type ||
      "text",
  ).toLowerCase();
  const hasOptions =
    toArray(field.options).length > 0 ||
    toArray(field.choices).length > 0 ||
    toArray(field.values).length > 0 ||
    toArray(field.meta?.options).length > 0;

  if (rawType.includes("multicheck") || rawType.includes("multi_select")) return "multicheck";
  if (
    rawType.includes("dropdown") ||
    rawType.includes("select") ||
    rawType.includes("single_select") ||
    rawType.includes("single_choice")
  ) {
    return "select";
  }
  if (rawType.includes("radio")) return "radio";
  if (rawType.includes("checkbox") && hasOptions) return "multicheck";
  if (rawType.includes("date")) return "date";
  if (rawType.includes("phone") || rawType.includes("tel")) return "tel";
  if (rawType.includes("email")) return "email";
  if (rawType.includes("url") || rawType.includes("linkedin")) return "url";
  if (rawType.includes("number") || rawType.includes("numeric")) return "number";
  if (rawType.includes("textarea") || rawType.includes("long")) return "textarea";
  // Graceful fallback: if backend sends an unknown type with options, treat as dropdown.
  if (hasOptions) return "select";
  return "text";
}

/**
 * Card grid for mission / outcomes (see design ref): 2-col cards, + / * affordance.
 * Set on interviewbit_form `meta.choice_layout` (or `ui_style` / `presentation`).
 */
function normalizeChoiceLayout(meta) {
  const raw = meta.choice_layout ?? meta.ui_style ?? meta.presentation ?? "";
  const s = String(raw).toLowerCase().trim().replace(/-/g, "_");
  if (s === "mission_cards" || s === "outcome_cards") return "mission_cards";
  return null;
}

function normalizeMaxSelections(meta, field) {
  const raw = meta.max_selections ?? meta.max_selection ?? field.max_selections ?? field.max_selection;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(100, Math.floor(n));
}

/** Option whose label is "Any other" / "Other" — enables a free-text companion field when selected. */
function findOtherOptionValue(options) {
  for (const opt of options) {
    const label = String(opt?.label ?? "").trim();
    if (/^any\s+other$/i.test(label) || /^other$/i.test(label)) {
      return String(opt.value);
    }
  }
  return null;
}

function normalizeField(field, index) {
  const meta = field.meta || {};
  const id =
    field.id ??
    field.form_id ??
    field.form_field_id ??
    field.question_id ??
    field.response_key ??
    `field_${index}`;

  const options = toArray(field.options || field.choices || field.values || meta.options)
    .map(toOption)
    .filter(Boolean);
  const otherOptionValue = findOtherOptionValue(options);

  const required =
    Boolean(field.required) ||
    Boolean(field.is_required) ||
    Boolean(field.mandatory);

  const { layoutWidth, layoutSpan } = inferLayoutWidth(field);
  const choiceLayout = normalizeChoiceLayout(meta);
  const maxSelections = normalizeMaxSelections(meta, field);

  return {
    id: String(id),
    label: field.label || field.title || field.question || `Field ${index + 1}`,
    placeholder: field.placeholder || meta.placeholder || "",
    helperText: field.description || field.help_text || "",
    otherOptionValue,
    choiceLayout,
    maxSelections,
    type: meta.textarea ? "textarea" : inferFieldType(field),
    rawType: String(
      field.form_type ||
        field.input_type ||
        field.field_type ||
        field.answer_type ||
        field.response_type ||
        "text",
    ).toLowerCase(),
    required,
    options,
    layoutWidth,
    layoutSpan,
  };
}

function normalizeFormTitleKey(title) {
  return String(title ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Groups fields into sub-section cards when `meta.sub_sections_config` lists headings + form_titles.
 * Matches each `form_titles[]` entry to `interviewbit_form.attributes.title`.
 */
function buildSubSections(pairedForms, meta) {
  const config = meta.sub_sections_config;
  if (!meta.sub_sections || !config || !toArray(config.sub_sections).length) {
    return null;
  }

  const byTitle = new Map();
  pairedForms.forEach(({ raw, field }) => {
    const key = normalizeFormTitleKey(raw.title ?? raw.label ?? field.label);
    byTitle.set(key, field);
  });

  const groups = [];
  const assigned = new Set();

  for (const def of toArray(config.sub_sections)) {
    const heading = String(def.heading ?? "").trim();
    const fields = [];
    for (const ft of toArray(def.form_titles)) {
      const f = byTitle.get(normalizeFormTitleKey(ft));
      if (f) {
        fields.push(f);
        assigned.add(f.id);
      }
    }
    if (fields.length > 0) {
      groups.push({ heading, fields });
    }
  }

  if (groups.length === 0) {
    return null;
  }

  const allFields = pairedForms.map((p) => p.field);
  const orphans = allFields.filter((f) => !assigned.has(f.id));
  if (orphans.length > 0 && groups.length > 0) {
    groups[groups.length - 1].fields.push(...orphans);
  }

  const n = Number(config.number_of_columns);
  const columns = Number.isFinite(n) && n >= 1 ? Math.min(12, Math.floor(n)) : 2;

  return {
    groups,
    type: String(config.type || "horizontal").toLowerCase() === "vertical" ? "vertical" : "horizontal",
    columns,
  };
}

function normalizeScreen(node, fallbackIndex) {
  const meta = node.meta || {};
  const attrs = node.attributes || {};
  const forms = [
    ...toArray(node.forms),
    ...toArray(node.questions),
    ...toArray(node.fields),
  ];

  if (forms.length === 0) {
    return null;
  }

  /** Top bar step title — only `meta.step_name` (not label / name) */
  const stepNameFromSection = meta.step_name ?? null;

  /** Small line above the section heading — section `label` (not the same as meta.step_name) */
  const sectionLabel =
    [node.label, attrs.label, meta.section_label, meta.label].find(
      (v) => v != null && String(v).trim() !== "",
    ) ?? null;

  const title =
    meta.heading ??
    meta.title ??
    attrs.heading ??
    attrs.title ??
    node.title ??
    node.name ??
    attrs.name ??
    stepNameFromSection ??
    sectionLabel ??
    `Screen ${fallbackIndex + 1}`;

  const pairedForms = forms
    .map((raw, idx) => ({ raw, field: normalizeField(raw, idx) }))
    .filter((p) => p.field.id);
  const sectionChoiceLayout = normalizeChoiceLayout(meta);
  const sectionMaxSelections = normalizeMaxSelections(meta, {});
  let normalizedFields = pairedForms.map((p) => p.field);
  if (sectionChoiceLayout) {
    normalizedFields = normalizedFields.map((f) => {
      if (f.type !== "multicheck") return f;
      return {
        ...f,
        choiceLayout: f.choiceLayout ?? sectionChoiceLayout,
        maxSelections: f.maxSelections ?? sectionMaxSelections,
      };
    });
  }
  const pairedForSub = pairedForms.map((p, i) => ({ ...p, field: normalizedFields[i] }));
  const sub = buildSubSections(pairedForSub, meta);

  return {
    id: String(node.id ?? node.section_id ?? `screen_${fallbackIndex}`),
    stepName: stepNameFromSection ?? title,
    sectionLabel: sectionLabel ? String(sectionLabel).trim() : null,
    title,
    description: meta.description || node.description || attrs.description || "",
    buttonText: meta.button_text || "",
    screenMeta: meta,
    fields: normalizedFields,
    subSections: sub?.groups ?? null,
    subSectionsLayout: sub ? { type: sub.type, columns: sub.columns } : null,
  };
}

function walkScreens(node, output) {
  if (!node || typeof node !== "object") {
    return;
  }

  const maybeScreen = normalizeScreen(node, output.length);
  if (maybeScreen && maybeScreen.fields.length > 0) {
    output.push(maybeScreen);
  }

  const children = [
    ...toArray(node.sections),
    ...toArray(node.sub_sections),
    ...toArray(node.subsections),
    ...toArray(node.form_sections),
    ...toArray(node.children),
  ];

  children.forEach((child) => walkScreens(child, output));
}

function getFormGroupNode(formGroupResponse) {
  if (formGroupResponse?.data?.[0]) return formGroupResponse.data[0];
  if (formGroupResponse?.data) return formGroupResponse.data;
  if (formGroupResponse?.form_group) return formGroupResponse.form_group;
  return formGroupResponse;
}

function buildIncludedIndex(formGroupResponse) {
  const index = new Map();
  toArray(formGroupResponse?.included).forEach((item) => {
    if (!item?.type || item?.id == null) return;
    index.set(`${item.type}:${String(item.id)}`, item);
  });
  return index;
}

function denormalizeJsonApiGraph(formGroupNode, includedIndex) {
  const groupAttributes = formGroupNode?.attributes || {};
  const sectionRefs =
    formGroupNode?.relationships?.interviewbit_form_sections?.data || [];

  const sections = sectionRefs
    .map((ref) => includedIndex.get(`${ref.type}:${String(ref.id)}`))
    .filter(Boolean)
    .map((sectionNode) => {
      const sectionAttributes = sectionNode.attributes || {};
      const formRefs =
        sectionNode?.relationships?.interviewbit_forms?.data || [];

      const forms = formRefs
        .map((ref) => includedIndex.get(`${ref.type}:${String(ref.id)}`))
        .filter(Boolean)
        .map((formNode) => formNode.attributes || {})
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return {
        ...sectionAttributes,
        forms,
      };
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    ...groupAttributes,
    sections,
  };
}

export function normalizeFormGroup(formGroupResponse) {
  const groupNodeRaw = getFormGroupNode(formGroupResponse);
  const includedIndex = buildIncludedIndex(formGroupResponse);
  const groupNode =
    groupNodeRaw?.relationships?.interviewbit_form_sections
      ? denormalizeJsonApiGraph(groupNodeRaw, includedIndex)
      : groupNodeRaw;
  const screens = [];
  walkScreens(groupNode, screens);

  if (screens.length === 0) {
    const fallback = normalizeScreen(groupNode, 0);
    if (fallback) {
      screens.push(fallback);
    }
  }

  const formGroupLabel =
    groupNode?.label ||
    groupNode?.attributes?.label ||
    groupNode?.name ||
    "Onboarding_Form_Academy_V2";

  const formGroupMeta = groupNode?.meta || groupNode?.attributes?.meta || {};

  return {
    formGroupLabel,
    screens,
    formGroupMeta,
  };
}

/** Labels for roadmap floating CTAs; prefers explicit timeline_* / roadmap_* in group or last section meta. */
export function getTimelineFloatingLabels(screens, formGroupMeta) {
  const gm = formGroupMeta || {};
  const last = screens?.length ? screens[screens.length - 1] : null;
  const lm = last?.screenMeta || {};

  return {
    primary:
      gm.timeline_primary_button_text ||
      gm.roadmap_primary_button_text ||
      lm.timeline_primary_button_text ||
      lm.roadmap_primary_button_text ||
      "Start this journey",
    secondary:
      gm.timeline_secondary_button_text ||
      gm.roadmap_email_button_text ||
      gm.email_this_button_text ||
      lm.timeline_secondary_button_text ||
      lm.roadmap_secondary_button_text ||
      lm.email_this_button_text ||
      "Questions? Request a callback",
  };
}
