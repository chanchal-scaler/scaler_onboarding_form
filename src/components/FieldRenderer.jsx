function Message({ error }) {
  return error ? <p className="error">{error.message}</p> : null;
}

function SelectField({ field, register, error }) {
  return (
    <>
      <select
        id={field.id}
        {...register(field.id, { required: field.required ? "This field is required." : false })}
      >
        <option value="">Select an option</option>
        {field.options.map((option) => (
          <option key={`${field.id}-${String(option.value)}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Message error={error} />
    </>
  );
}

function ChoiceField({ field, register, error, type }) {
  const className = type === "checkbox" ? "checkbox-group" : "radio-group";
  const itemClass = type === "checkbox" ? "checkbox-option" : "radio-option";
  const rule = type === "checkbox"
    ? { validate: (v) => !field.required || (Array.isArray(v) && v.length > 0) || "Please select at least one option." }
    : { required: field.required ? "Please select one option." : false };
  return (
    <>
      <div className={className}>
        {field.options.map((option) => (
          <label key={`${field.id}-${String(option.value)}`} className={itemClass}>
            <input type={type} value={String(option.value)} {...register(field.id, rule)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <Message error={error} />
    </>
  );
}

export function FieldRenderer({ field, register, errors }) {
  const error = errors[field.id];
  if (field.type === "select") return <SelectField field={field} register={register} error={error} />;
  if (field.type === "radio") return <ChoiceField field={field} register={register} error={error} type="radio" />;
  if (field.type === "multicheck") return <ChoiceField field={field} register={register} error={error} type="checkbox" />;
  if (field.type === "textarea") {
    return (
      <>
        <textarea id={field.id} rows={4} placeholder={field.placeholder} {...register(field.id, { required: field.required ? "This field is required." : false })} />
        <Message error={error} />
      </>
    );
  }
  return (
    <>
      <input id={field.id} type={field.type} placeholder={field.placeholder} {...register(field.id, { required: field.required ? "This field is required." : false })} />
      <Message error={error} />
    </>
  );
}
