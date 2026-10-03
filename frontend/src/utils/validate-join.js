// Join form rules, moved from the HTML prototype (site/js/join.js).
// In the prototype each rule read straight from the form on the page. Here
// validateJoin() receives the answers as a plain object and returns the problems,
// so it never touches the page. Same answers in, same errors out: a pure function.
// The server will repeat these checks in Phase 3. Never trust the browser alone.

export const MESSAGE_MAX = 500;

// A simple email check: something@something.something with no spaces.
// (Perfect email validation is famously hard. This catches real typos.)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The order fields appear on the page, so we can find the FIRST problem.
export const FIELD_ORDER = ["fullName", "email", "positions", "experience", "message"];

// Messages explain the fix (brand voice), not just "Invalid input".
const rules = {
  fullName: (values) =>
    values.fullName.trim() === "" ? "Enter your name so we know who to welcome." : "",

  email: (values) => {
    const email = values.email.trim();
    if (email === "") return "Enter an email so we can reply.";
    if (!EMAIL_PATTERN.test(email)) return "Check your email. It should look like name@example.com.";
    return "";
  },

  positions: (values) =>
    values.positions.length === 0 ? "Choose at least one position you’d like to try." : "",

  experience: (values) => (values.experience ? "" : "Choose your experience level."),

  message: (values) =>
    values.message.length > MESSAGE_MAX ? `Keep your message under ${MESSAGE_MAX} characters.` : "",
};

// Check one field. Returns its error message, or "" when it's fine.
export function validateField(fieldName, values) {
  return rules[fieldName](values);
}

// Check everything. Returns only the fields with problems, e.g.
// { email: "Enter an email so we can reply." }. An empty object means all good.
export function validateJoin(values) {
  const errors = {};
  for (const fieldName of FIELD_ORDER) {
    const message = validateField(fieldName, values);
    if (message) errors[fieldName] = message;
  }
  return errors;
}
