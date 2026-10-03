import { useEffect, useRef, useState } from "react";
import FieldError from "../components/FieldError.jsx";
import { FIELD_ORDER, MESSAGE_MAX, validateField, validateJoin } from "../utils/validate-join.js";

const POSITIONS = [
  "Vocals",
  "Keys",
  "Acoustic guitar",
  "Electric guitar",
  "Bass",
  "Drums",
  "Sound",
  "Lyrics/Projection",
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "some", label: "Some experience" },
  { value: "experienced", label: "Experienced" },
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  positions: [],
  experience: "",
  message: "",
};

export default function JoinPage() {
  // State is the form's memory. In the prototype the answers lived only in the
  // inputs on the page. Here React holds them, and the inputs just show what's in
  // state. (These are called "controlled inputs".)
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sentBy, setSentBy] = useState(null); // the applicant's name once sent

  // Refs point at real elements on the page, for the few jobs React can't do by
  // redrawing alone, like moving keyboard focus.
  const formRef = useRef(null);
  const confirmationRef = useRef(null);

  // After a successful send, move focus to the thank-you message so screen
  // reader users hear it straight away. It runs after React has drawn the
  // message, which is why it's an effect and not part of handleSubmit.
  useEffect(() => {
    if (sentBy) confirmationRef.current?.focus();
  }, [sentBy]);

  // Save new answers. If that field is already showing an error, re-check it
  // straight away so the error clears as soon as it's fixed. We don't check
  // untouched fields while people are still typing, so nobody gets scolded mid-word.
  function updateValues(fieldName, newValues) {
    setValues(newValues);
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: validateField(fieldName, newValues) });
    }
  }

  // One handler for all text fields: the input's name says which answer changed.
  function handleTextChange(event) {
    const { name, value } = event.target;
    updateValues(name, { ...values, [name]: value });
  }

  // Ticking a checkbox adds that position to the list; unticking removes it.
  function handlePositionToggle(position) {
    const positions = values.positions.includes(position)
      ? values.positions.filter((p) => p !== position)
      : [...values.positions, position];
    updateValues("positions", { ...values, positions });
  }

  function handleSubmit(event) {
    // Stop the browser from sending the form and reloading the page.
    event.preventDefault();

    const newErrors = validateJoin(values);
    setErrors(newErrors);

    const firstProblem = FIELD_ORDER.find((fieldName) => newErrors[fieldName]);
    if (firstProblem) {
      // Move focus to the first problem field. For checkbox and radio groups,
      // that's the first box in the group.
      formRef.current.querySelector(`[name="${firstProblem}"]`).focus();
      return;
    }

    const application = {
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    };

    // TODO: Phase 3 sends this to the back end: POST /api/join-requests/
    console.log("Join application (not saved yet, Phase 1):", application);
    setSentBy(application.fullName);
  }

  // Helper: true/false for aria-invalid, so screen readers announce problem fields.
  const isInvalid = (fieldName) => Boolean(errors[fieldName]);

  return (
    <div className="page container">
      <title>Join the team · Tehillim</title>
      <h1>Join the team</h1>

      <blockquote className="th-verse">
        <p>Sing unto him a new song; play skilfully with a loud noise.</p>
        <cite>Psalm 33:3</cite>
      </blockquote>

      <p className="join-intro">
        Whether you sing, play, or prefer the sound desk, we’d love to hear from you. Fill in the
        form and a team leader will get in touch.
      </p>

      {sentBy ? (
        // tabIndex={-1} lets us move focus here from code, without adding it to the Tab order.
        <div className="join-confirmation" tabIndex={-1} ref={confirmationRef}>
          <h2>Thank you, {sentBy}</h2>
          <p>We’ve received your application. A team leader will be in touch soon.</p>
        </div>
      ) : (
        // noValidate: we show our own friendly messages instead of the browser's pop-ups.
        <form className="join-form" noValidate onSubmit={handleSubmit} ref={formRef}>
          <div className={`th-field ${isInvalid("fullName") ? "th-field--error" : ""}`}>
            {/* htmlFor is JSX's name for the HTML "for" attribute ("for" means loops in JS). */}
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={values.fullName}
              onChange={handleTextChange}
              aria-invalid={isInvalid("fullName")}
              aria-describedby="fullName-error"
            />
            <FieldError id="fullName-error" message={errors.fullName} />
          </div>

          <div className={`th-field ${isInvalid("email") ? "th-field--error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleTextChange}
              aria-invalid={isInvalid("email")}
              aria-describedby="email-error"
            />
            <FieldError id="email-error" message={errors.email} />
          </div>

          <div className="th-field">
            <label htmlFor="phone">
              Phone <span className="th-field__hint">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={handleTextChange}
            />
          </div>

          {/* fieldset + legend groups the checkboxes, so a screen reader reads the
              question before each option. */}
          <fieldset className="th-field choice-group" aria-describedby="positions-error">
            <legend>Positions you’re interested in</legend>
            {POSITIONS.map((position) => (
              <label className="choice" key={position}>
                <input
                  type="checkbox"
                  name="positions"
                  value={position}
                  checked={values.positions.includes(position)}
                  onChange={() => handlePositionToggle(position)}
                  aria-invalid={isInvalid("positions")}
                />{" "}
                {position}
              </label>
            ))}
            <FieldError id="positions-error" message={errors.positions} />
          </fieldset>

          <fieldset className="th-field choice-group" aria-describedby="experience-error">
            <legend>Experience level</legend>
            {EXPERIENCE_LEVELS.map((level) => (
              <label className="choice" key={level.value}>
                <input
                  type="radio"
                  name="experience"
                  value={level.value}
                  checked={values.experience === level.value}
                  onChange={handleTextChange}
                  aria-invalid={isInvalid("experience")}
                />{" "}
                {level.label}
              </label>
            ))}
            <FieldError id="experience-error" message={errors.experience} />
          </fieldset>

          <div className={`th-field th-field--wide ${isInvalid("message") ? "th-field--error" : ""}`}>
            <label htmlFor="message">
              Message <span className="th-field__hint">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={values.message}
              onChange={handleTextChange}
              aria-invalid={isInvalid("message")}
              aria-describedby="message-count message-error"
            />
            {/* The counter is just state shown on screen. No extra code needed to update it. */}
            <p className="th-field__hint" id="message-count" aria-live="polite">
              {values.message.length} / {MESSAGE_MAX} characters
            </p>
            <FieldError id="message-error" message={errors.message} />
          </div>

          {/* The page's one pomegranate button. It says exactly what happens. */}
          <button className="th-btn th-btn--primary" type="submit">
            Send application
          </button>
        </form>
      )}
    </div>
  );
}
