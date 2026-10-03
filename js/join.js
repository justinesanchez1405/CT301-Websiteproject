/*
  join.js: only loaded on join.html
  ---------------------------------
  Checks the Join form before it's sent:
  - shows an error message next to each field that needs fixing
  - clears each error as soon as the visitor fixes it
  - moves keyboard focus to the first problem, so nobody has to hunt for it
  - on success, shows a thank-you message (Phase 1 doesn't save anything yet)

  The form has `novalidate`, which turns off the browser's own pop-up bubbles
  so our friendlier, on-brand messages are used instead.
*/

const form = document.getElementById("join-form");
const MESSAGE_MAX = 500;

// A simple email check: something@something.something with no spaces.
// (Perfect email validation is famously hard. This catches real typos;
// the server double-checks in Phase 3.)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each rule returns an error message, or "" when the field is fine.
// Messages explain the fix (brand voice), not just "Invalid input".
const rules = {
  fullName: () =>
    form.fullName.value.trim() === "" ? "Enter your name so we know who to welcome." : "",

  email: () => {
    const value = form.email.value.trim();
    if (value === "") return "Enter an email so we can reply.";
    if (!EMAIL_PATTERN.test(value)) return "Check your email. It should look like name@example.com.";
    return "";
  },

  positions: () =>
    form.querySelectorAll("input[name='positions']:checked").length === 0
      ? "Choose at least one position you’d like to try."
      : "",

  experience: () =>
    form.querySelector("input[name='experience']:checked") ? "" : "Choose your experience level.",

  message: () =>
    form.message.value.length > MESSAGE_MAX
      ? `Keep your message under ${MESSAGE_MAX} characters.`
      : "",
};

// Show or clear the error for one field. Each field's wrapper has
// data-field="fullName" etc., and contains a <p class="th-field__error">.
function showError(fieldName, message) {
  const wrapper = form.querySelector(`[data-field="${fieldName}"]`);
  const errorText = wrapper.querySelector(".th-field__error");

  errorText.textContent = message;
  wrapper.classList.toggle("th-field--error", message !== "");

  // aria-invalid tells screen readers the field has a problem. The error <p> is
  // linked to the input with aria-describedby (in the HTML), so it's read out too.
  wrapper.querySelectorAll("input, textarea").forEach((input) => {
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  });
}

// Check one field and report whether it passed.
function validateField(fieldName) {
  const message = rules[fieldName]();
  showError(fieldName, message);
  return message === "";
}

// Live character counter for the message box.
const counter = document.getElementById("message-count");
function updateCounter() {
  counter.textContent = `${form.message.value.length} / ${MESSAGE_MAX} characters`;
}

// Clear errors while the visitor fixes them. We only re-check a field that is
// already showing an error, so people aren't scolded while they're still typing.
form.addEventListener("input", (event) => {
  const wrapper = event.target.closest("[data-field]");
  if (event.target.name === "message") updateCounter();
  if (wrapper && wrapper.classList.contains("th-field--error")) {
    validateField(wrapper.dataset.field);
  }
});

form.addEventListener("submit", (event) => {
  // Stop the browser from sending the form and reloading the page.
  event.preventDefault();

  // Check every field (not just until the first failure), so all errors show at once.
  const results = Object.keys(rules).map((fieldName) => ({ fieldName, ok: validateField(fieldName) }));
  const firstProblem = results.find((result) => !result.ok);

  if (firstProblem) {
    // Move focus to the first problem field so keyboard and screen reader users land on it.
    form.querySelector(`[data-field="${firstProblem.fieldName}"] input, [data-field="${firstProblem.fieldName}"] textarea`).focus();
    return;
  }

  // Everything is valid: collect the answers into one object.
  const application = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    positions: [...form.querySelectorAll("input[name='positions']:checked")].map((box) => box.value),
    experience: form.querySelector("input[name='experience']:checked").value,
    message: form.message.value.trim(),
  };

  // TODO: Phase 3 sends this to the back end: POST /api/join-requests/
  console.log("Join application (not saved yet, Phase 1):", application);

  // Swap the form for a thank-you message, and move focus to it so
  // screen reader users hear it straight away.
  const confirmation = document.getElementById("join-confirmation");
  confirmation.querySelector("[data-applicant-name]").textContent = application.fullName;
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.focus();
});

updateCounter();
