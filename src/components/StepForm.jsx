import { Fragment } from "react";
import { FieldRenderer } from "./FieldRenderer";
import { displayLabel } from "../utils/displayCase";

export function StepForm({
  screen,
  formState,
  register,
  watch,
  control,
  onNext,
  currentStep,
  totalSteps,
  isSubmitting,
  submitError,
  isSubmitted,
}) {
  const isLast = currentStep === totalSteps - 1;
  const fromApi = screen.buttonText?.trim();
  let actionLabel;
  if (isSubmitting && isLast) {
    actionLabel = "Submitting...";
  } else if (fromApi) {
    actionLabel = fromApi;
  } else if (isLast) {
    actionLabel = "Submit";
  } else {
    actionLabel = "Continue";
  }
  const isWideField = (field) =>
    field.type === "textarea" || field.type === "multicheck" || field.type === "radio";

  const fieldCellClassName = (field) => {
    if (isWideField(field)) return "field full";
    const span = field.layoutSpan;
    if (span != null && span >= 1 && span <= 12) return "field field--layout";
    if (field.layoutWidth) return `field field--layout field--${field.layoutWidth}`;
    return "field field--layout field--small";
  };

  const fieldCellStyle = (field) => {
    if (isWideField(field)) return undefined;
    const span = field.layoutSpan;
    if (span != null && span >= 1 && span <= 12) {
      return { gridColumn: `span ${span}` };
    }
    return undefined;
  };

  /** Inside sub-section cards, fields span the card width (reference UI). */
  const fieldCellClassNameInCard = (field) =>
    isWideField(field) ? "field full" : "field full sub-section-field";

  const statusHint =
    screen.screenMeta?.status_hint ||
    "This helps us personalize the guidance that follows.";

  const rawKicker = screen.sectionLabel || screen.screenMeta?.category;
  const sectionLabelDisplay = displayLabel(rawKicker);
  const titleDisplay = (screen.title ?? "").trim();
  const descriptionDisplay = (screen.description ?? "").trim() || null;

  const showSectionLabel =
    sectionLabelDisplay &&
    titleDisplay &&
    sectionLabelDisplay.toLowerCase() !== titleDisplay.toLowerCase();

  const subSections = screen.subSections?.length ? screen.subSections : null;
  const subLayoutType = screen.subSectionsLayout?.type ?? "horizontal";
  const subCols = screen.subSectionsLayout?.columns ?? 2;
  /** Last row incomplete → last card spans full width (e.g. 2 columns + 3 cards). */
  const subTrailingFull =
    subSections &&
    subLayoutType === "horizontal" &&
    subCols > 0 &&
    subSections.length % subCols !== 0;

  const renderFieldRow = (field, inCard) => (
    <div
      key={field.id}
      className={`${inCard ? fieldCellClassNameInCard(field) : fieldCellClassName(field)}${
        field.choiceLayout === "mission_cards" ? " field--mission-cards" : ""
      }`}
      style={inCard ? undefined : fieldCellStyle(field)}
    >
      {field.choiceLayout === "mission_cards" ? (
        <p className="field-label field-label--mission-kicker" id={`${field.id}-caption`}>
          {field.label}
        </p>
      ) : (
        <label htmlFor={field.id}>{field.label}</label>
      )}
      <FieldRenderer
        field={field}
        register={register}
        watch={watch}
        errors={formState.errors}
        control={control}
      />
    </div>
  );

  const stepBody = (
    <>
      <div className="narrative-head step-narrative-head">
        {showSectionLabel ? (
          <p className="narrative-section-label">{sectionLabelDisplay}</p>
        ) : null}
        {titleDisplay ? <h2 className="section-title">{titleDisplay}</h2> : null}
        {descriptionDisplay ? <p className="section-subtitle">{descriptionDisplay}</p> : null}
      </div>
      <div className="form-shell">
        <form
          onSubmit={onNext}
          className={subSections ? "step-form step-form--sub-sections" : "field-grid field-grid--layout"}
        >
          {subSections ? (
            <div
              className={`sub-sections-root sub-sections-root--${subLayoutType} ${
                subTrailingFull ? "sub-sections-root--trailing-full" : ""
              }`}
              style={{ "--sub-cols": subLayoutType === "vertical" ? 1 : subCols }}
            >
              {subSections.map((sub, idx) => (
                <section key={`${sub.heading}-${idx}`} className="sub-section-card">
                  {sub.heading ? (
                    <h3 className="sub-section-card__title">{displayLabel(sub.heading) || sub.heading}</h3>
                  ) : null}
                  <div className="sub-section-card__fields">{sub.fields.map((f) => renderFieldRow(f, true))}</div>
                </section>
              ))}
            </div>
          ) : (
            screen.fields.map((field) => renderFieldRow(field, false))
          )}
          <div className="cta-row field full cta-row--form">
            <button
              className="button"
              type="submit"
              data-track-id={`form_primary_submit_${screen.id}`}
              disabled={isSubmitting}
            >
              {actionLabel} {!isSubmitting ? <i className="ph ph-arrow-right" aria-hidden /> : null}
            </button>
            <p className="status-line">
              <i className="ph ph-shield-check" aria-hidden />
              {statusHint}
            </p>
          </div>
        </form>
      </div>
    </>
  );

  const stepFooter = (
    <>
      {submitError && <p className="error">Submission failed: {String(submitError)}</p>}
      {isSubmitted && <p className="success">Form submitted successfully.</p>}
    </>
  );

  if (subSections) {
    return (
      <div className="step-screen step-screen--sub-sections">
        {stepBody}
        {stepFooter}
      </div>
    );
  }

  return (
    <Fragment>
      {stepBody}
      {stepFooter}
    </Fragment>
  );
}
