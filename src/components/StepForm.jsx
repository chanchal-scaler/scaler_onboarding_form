import { FieldRenderer } from "./FieldRenderer";

export function StepForm({
  screen,
  formState,
  register,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  isSubmitting,
  submitError,
  isSubmitted,
}) {
  return (
    <main className="card">
      <h2>{screen.title}</h2>
      {screen.description && <p>{screen.description}</p>}
      <form onSubmit={onNext} className="form">
        {screen.fields.map((field) => (
          <div key={field.id} className="field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <FieldRenderer field={field} register={register} errors={formState.errors} />
            {field.helperText && <small>{field.helperText}</small>}
          </div>
        ))}
        <div className="actions">
          <button type="button" onClick={onBack} disabled={currentStep === 0}>
            Back
          </button>
          <button type="submit" disabled={isSubmitting}>
            {currentStep === totalSteps - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
          </button>
        </div>
      </form>
      {submitError && <p className="error">Submission failed: {String(submitError)}</p>}
      {isSubmitted && <p className="success">Form submitted successfully.</p>}
    </main>
  );
}
