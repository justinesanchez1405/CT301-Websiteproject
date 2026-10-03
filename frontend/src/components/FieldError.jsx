// The red message under a form field. Draws nothing when there's no error.
// The id lets the field point at it with aria-describedby, so screen readers
// read the error out together with the field.
export default function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="th-field__error" id={id}>
      {message}
    </p>
  );
}
