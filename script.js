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

  // Submit to Formspree via AJAX so we can swap in the confirmation
  // in place instead of redirecting away. Resolves on success; rejects
  // with a user-facing message on failure.
  function submitEmail() {
    button.disabled = true;
    button.textContent = 'Joining…';

    return fetch(form.action, {
      method: (form.method || 'POST').toUpperCase(),
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) return;
      // Surface Formspree's validation message when available.
      return res.json().then(function (data) {
        var msg = data && data.errors && data.errors.length
          ? data.errors.map(function (er) { return er.message; }).join(', ')
          : 'Something went wrong. Please try again.';
        throw new Error(msg);
      }, function () {
        throw new Error('Something went wrong. Please try again.');
      });
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

    submitEmail()
      .then(function () {
        form.hidden = true;
        confirmation.hidden = false;
      })
      .catch(function (err) {
        button.disabled = false;
        button.textContent = 'Notify me';
        showError((err && err.message) || 'Something went wrong. Please try again.');
      });
  });
})();
