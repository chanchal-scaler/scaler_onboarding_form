import { Controller } from "react-hook-form";
import { otherFieldKey } from "../utils/formValues";
import { getRegisterOptionsForValidationType } from "../utils/validationType";

function Message({ error }) {
  return error ? <p className="error">{error.message}</p> : null;
}

function validateMulticheck(field, value) {
  const arr = Array.isArray(value) ? value : [];
  if (field.required && arr.length === 0) return "Please select at least one option.";
  if (field.maxSelections != null && arr.length > field.maxSelections) {
    return `Choose at most ${field.maxSelections} outcomes.`;
  }
  return true;
}

function selectOtherPlaceholder(field) {
  const label = String(field.label ?? "").trim();
  if (/current job role/i.test(label)) return "Enter your role";
  return field.placeholder || "Please specify";
}

function SelectField({ field, register, watch, errors, error }) {
  const selected = watch(field.id);
  const otherKey = field.otherOptionValue != null ? otherFieldKey(field.id) : null;
  const showOther =
    field.otherOptionValue != null &&
    selected != null &&
    selected !== "" &&
    String(selected) === String(field.otherOptionValue);
  const otherError = otherKey ? errors?.[otherKey] : null;
  const otherPlaceholder = selectOtherPlaceholder(field);

  return (
    <>
      <select
        id={field.id}
        {...register(field.id, getRegisterOptionsForValidationType(field))}
      >
        <option value="">Select an option</option>
        {field.options.map((option) => (
          <option key={`${field.id}-${String(option.value)}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showOther && otherKey ? (
        <div className="multicheck-other-input select-other-input">
          <input
            type="text"
            id={otherKey}
            placeholder={otherPlaceholder}
            autoComplete="organization-title"
            aria-label={otherPlaceholder}
            {...register(otherKey, {
              validate: (v) => {
                if (!showOther) return true;
                if (String(v).trim()) return true;
                return /current job role/i.test(String(field.label ?? "").trim())
                  ? "Please enter your role."
                  : "Please specify.";
              },
            })}
          />
        </div>
      ) : null}
      <Message error={error} />
      <Message error={otherError} />
    </>
  );
}

function ChoiceField({ field, register, watch, errors, error, type }) {
  const className = type === "checkbox" ? "checkbox-group" : "radio-group";
  const itemClass = type === "checkbox" ? "checkbox-option" : "radio-option";
  const selectedValues = watch(field.id);
  const asArray = Array.isArray(selectedValues) ? selectedValues.map(String) : [];
  const asSingle = selectedValues == null ? "" : String(selectedValues);
  const rule =
    type === "checkbox"
      ? { validate: (v) => validateMulticheck(field, v) }
      : { required: field.required ? "Please select one option." : false };
  const otherKey =
    type === "radio" && field.otherOptionValue != null ? otherFieldKey(field.id) : null;
  const showRadioOther =
    type === "radio" &&
    field.otherOptionValue != null &&
    asSingle === String(field.otherOptionValue);
  const otherError = otherKey ? errors?.[otherKey] : null;
  const otherPlaceholder = selectOtherPlaceholder(field);

  return (
    <>
      <div className={className}>
        {field.options.map((option) => (
          <label
            key={`${field.id}-${String(option.value)}`}
            className={`${itemClass} ${
              type === "checkbox"
                ? asArray.includes(String(option.value))
                  ? "selected"
                  : ""
                : asSingle === String(option.value)
                  ? "selected"
                  : ""
            }`}
          >
            <input type={type} value={String(option.value)} {...register(field.id, rule)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {showRadioOther && otherKey ? (
        <div className="multicheck-other-input select-other-input">
          <input
            type="text"
            id={otherKey}
            placeholder={otherPlaceholder}
            autoComplete="organization-title"
            aria-label={otherPlaceholder}
            {...register(otherKey, {
              validate: (v) => {
                if (!showRadioOther) return true;
                if (String(v).trim()) return true;
                return /current job role/i.test(String(field.label ?? "").trim())
                  ? "Please enter your role."
                  : "Please specify.";
              },
            })}
          />
        </div>
      ) : null}
      <Message error={error} />
      <Message error={otherError} />
    </>
  );
}

function MulticheckField({ field, register, watch, error }) {
  const selectedValues = watch(field.id);
  const asArray = Array.isArray(selectedValues) ? selectedValues.map(String) : [];
  const otherKey = field.otherOptionValue != null ? otherFieldKey(field.id) : null;
  const showOther =
    field.otherOptionValue != null && asArray.includes(String(field.otherOptionValue));
  const rule = {
    validate: (v) => validateMulticheck(field, v),
  };

  return (
    <>
      <div className="checkbox-group">
        {field.options.map((option) => (
          <label
            key={`${field.id}-${String(option.value)}`}
            className={`checkbox-option ${asArray.includes(String(option.value)) ? "selected" : ""}`}
          >
            <input type="checkbox" value={String(option.value)} {...register(field.id, rule)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {showOther && otherKey ? (
        <div className="multicheck-other-input">
          <input
            type="text"
            id={otherKey}
            placeholder={field.placeholder || "Add details"}
            autoComplete="off"
            {...register(otherKey)}
          />
        </div>
      ) : null}
      <Message error={error} />
    </>
  );
}

function MissionMulticheckField({ field, control, watch, register, error }) {
  const selectedValues = watch(field.id);
  const asArray = Array.isArray(selectedValues) ? selectedValues.map(String) : [];
  const otherKey = field.otherOptionValue != null ? otherFieldKey(field.id) : null;
  const showOther =
    field.otherOptionValue != null && asArray.includes(String(field.otherOptionValue));
  const cap = field.maxSelections != null ? field.maxSelections : Infinity;

  return (
    <>
      <Controller
        name={field.id}
        control={control}
        rules={{ validate: (v) => validateMulticheck(field, v) }}
        render={({ field: cf }) => {
          const selected = Array.isArray(cf.value) ? cf.value.map(String) : [];
          const toggle = (rawVal) => {
            const sv = String(rawVal);
            const cur = Array.isArray(cf.value) ? cf.value : [];
            if (selected.includes(sv)) {
              cf.onChange(cur.filter((x) => String(x) !== sv));
            } else if (cur.length < cap) {
              cf.onChange([...cur, rawVal]);
            }
          };

          return (
            <div
              className="mission-card-grid"
              role="group"
              aria-labelledby={`${field.id}-caption`}
            >
              {field.options.map((option) => {
                const isOn = selected.includes(String(option.value));
                return (
                  <label
                    key={`${field.id}-${String(option.value)}`}
                    className={`mission-card ${isOn ? "mission-card--selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="mission-card__input"
                      checked={isOn}
                      onChange={() => toggle(option.value)}
                      value={String(option.value)}
                    />
                    <span className="mission-card__glyph" aria-hidden>
                      {isOn ? "*" : "+"}
                    </span>
                    <span className="mission-card__text">{option.label}</span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
      {showOther && otherKey ? (
        <div className="multicheck-other-input mission-card-other-input">
          <input
            type="text"
            id={otherKey}
            placeholder={field.placeholder || "Add details"}
            autoComplete="off"
            {...register(otherKey)}
          />
        </div>
      ) : null}
      {field.helperText ? <p className="mission-card-hint">{field.helperText}</p> : null}
      <Message error={error} />
    </>
  );
}

export function FieldRenderer({ field, register, watch, errors, control }) {
  const error = errors[field.id];

  if (field.type === "select")
    return <SelectField field={field} register={register} watch={watch} errors={errors} error={error} />;
  if (field.type === "radio")
    return (
      <ChoiceField field={field} register={register} watch={watch} errors={errors} error={error} type="radio" />
    );

  if (field.type === "multicheck" && field.choiceLayout === "mission_cards" && control) {
    return (
      <MissionMulticheckField
        field={field}
        control={control}
        watch={watch}
        register={register}
        error={error}
      />
    );
  }

  if (field.type === "multicheck" && field.otherOptionValue != null) {
    return <MulticheckField field={field} register={register} watch={watch} error={error} />;
  }
  if (field.type === "multicheck")
    return (
      <ChoiceField field={field} register={register} watch={watch} errors={errors} error={error} type="checkbox" />
    );
  if (field.type === "textarea") {
    return (
      <>
        <textarea
          id={field.id}
          rows={4}
          placeholder={field.placeholder}
          {...register(field.id, getRegisterOptionsForValidationType(field))}
        />
        <Message error={error} />
      </>
    );
  }
  return (
    <>
      <input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        {...register(field.id, getRegisterOptionsForValidationType(field))}
      />
      <Message error={error} />
    </>
  );
}
