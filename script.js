/* Intro film: play once full-screen, then loop silently behind the content.
   The footage ends on a baked-in title card that would clash with the page's
   own logo, so the background loop restarts just before it. */
(function () {
  'use strict';

  var root = document.documentElement;
  var video = document.getElementById('intro-video');
  var skip = document.getElementById('intro-skip');
  if (!video) return;

  var LOOP_END = 4.6;        // seconds; the title card cuts in at ~4.9s
  var INTRO_TIMEOUT = 12000; // never hold the page hostage to a slow network
  var live = !root.classList.contains('is-intro');
  var guard;

  video.muted = true; // autoplay is only permitted without sound
  video.loop = false; // the `loop` attribute is just the no-JS fallback

  function play() {
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(goLive);
  }

  function goLive() {
    if (live) return;
    live = true;
    clearTimeout(guard);
    root.classList.remove('is-intro');
    try { sessionStorage.setItem('rabbitt-intro-seen', '1'); } catch (e) { /* storage blocked */ }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Still first frame instead of a moving background.
    video.autoplay = false;
    video.pause();
    return;
  }

  video.addEventListener('timeupdate', function () {
    if (live && video.currentTime >= LOOP_END) video.currentTime = 0;
  });

  video.addEventListener('ended', function () {
    goLive();
    video.currentTime = 0;
    play();
  });

  // Anything that stops the film playing through reveals the page instead.
  video.addEventListener('error', goLive);
  skip.addEventListener('click', goLive);

  if (!live) {
    guard = setTimeout(goLive, INTRO_TIMEOUT);
    play();
  }
})();

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

  function resetTurnstile() {
    if (window.turnstile && typeof window.turnstile.reset === 'function') {
      try { window.turnstile.reset(); } catch (e) { /* widget not rendered yet */ }
    }
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

    // Cloudflare Turnstile injects this hidden field once it has a token.
    // If it's missing/empty, the challenge isn't ready or needs interaction.
    var token = form.querySelector('[name="cf-turnstile-response"]');
    if (!token || !token.value) {
      showError('Please complete the verification, then try again.');
      resetTurnstile();
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
        resetTurnstile(); // token is single-use; get a fresh one for retry
      });
  });
})();
