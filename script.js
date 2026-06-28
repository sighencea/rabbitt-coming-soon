(function () {
  'use strict';

  var form = document.getElementById('waitlist-form');
  var row = form.querySelector('.form__row');
  var input = document.getElementById('email');
  var button = form.querySelector('.form__button');
  var error = document.getElementById('form-error');
  var confirmation = document.getElementById('confirmation');

  // Basic, pragmatic email check on top of the native type="email".
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    row.classList.add('is-invalid');
  }

  function clearError() {
    error.hidden = true;
    error.textContent = '';
    row.classList.remove('is-invalid');
  }

  // Front-end only: swap the form for the confirmation block.
  // In production, POST the email to your mailing-list provider
  // (Mailchimp, Klaviyo, ConvertKit, Resend, ...) and only show
  // the confirmation on a successful response.
  function submitEmail(email) {
    button.disabled = true;
    button.textContent = 'Joining…';

    // Simulated async request. Replace with a real fetch():
    //   return fetch('/api/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: email })
    //   }).then(function (res) { if (!res.ok) throw new Error(); });
    return new Promise(function (resolve) {
      setTimeout(resolve, 600);
    });
  }

  input.addEventListener('input', clearError);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = input.value.trim();

    if (!email) {
      showError('Please enter your email.');
      input.focus();
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showError('That email doesn’t look right.');
      input.focus();
      return;
    }

    clearError();

    submitEmail(email)
      .then(function () {
        form.hidden = true;
        confirmation.hidden = false;
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Notify me';
        showError('Something went wrong. Please try again.');
      });
  });
})();
