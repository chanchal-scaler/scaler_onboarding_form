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

  const required =
    Boolean(field.required) ||
    Boolean(field.is_required) ||
    Boolean(field.mandatory);

  return {
    id: String(id),
    label: field.label || field.title || field.question || `Field ${index + 1}`,
    placeholder: field.placeholder || meta.placeholder || "",
    helperText: field.description || field.help_text || "",
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
  };
}

function normalizeScreen(node, fallbackIndex) {
  const meta = node.meta || {};
  const forms = [
    ...toArray(node.forms),
    ...toArray(node.questions),
    ...toArray(node.fields),
  ];

  if (forms.length === 0) {
    return null;
  }

  return {
    id: String(node.id ?? node.section_id ?? `screen_${fallbackIndex}`),
    title: meta.heading || meta.step_name || node.label || node.title || node.name || `Screen ${fallbackIndex + 1}`,
    description: meta.description || node.description || "",
    fields: forms.map(normalizeField).filter((field) => field.id),
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

  return {
    formGroupLabel,
    screens,
  };
}
