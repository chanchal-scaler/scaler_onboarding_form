export function StateScreen({ title, message }) {
  return (
    <div className="state-screen default-screen">
      <div className="page">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
