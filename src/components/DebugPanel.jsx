export function DebugPanel({ formGroupLabel, allValues, submitResponse }) {
  return (
    <section className="debug">
      <h3>Draft Payload Preview</h3>
      <pre>
        {JSON.stringify(
          {
            form_group_label: formGroupLabel,
            form_responses: allValues,
            auto_save: false,
          },
          null,
          2,
        )}
      </pre>
      {submitResponse && (
        <>
          <h3>Submit API Response</h3>
          <pre>{JSON.stringify(submitResponse, null, 2)}</pre>
        </>
      )}
    </section>
  );
}
