
/* Mana Hakku - Login and Registration pages */
(function () {
  'use strict';

  window.MH_PAGES = window.MH_PAGES || {};

  function escapeText(value) {
    return window.MH.escape(String(value == null ? '' : value));
  }

  function login(el) {
    var isTelugu = window.MH.lang === 'te';

    el.innerHTML =
      '<div class="card" style="max-width:460px;margin:40px auto;padding:28px;">' +
        '<h1>' + (isTelugu ? 'లాగిన్' : 'Login') + '</h1>' +
        '<p>' + (isTelugu ? 'మీ ఖాతాలోకి ప్రవేశించండి' : 'Sign in to your Mana Hakku account.') + '</p>' +
        '<form id="login-form">' +
          '<div class="field">' +
            '<label for="login-email">Email</label>' +
            '<input class="input" id="login-email" type="email" required autocomplete="email">' +
          '</div>' +
          '<div class="field">' +
            '<label for="login-password">' + (isTelugu ? 'పాస్‌వర్డ్' : 'Password') + '</label>' +
            '<input class="input" id="login-password" type="password" required autocomplete="current-password">' +
          '</div>' +
          '<div class="form-actions">' +
            '<button class="btn btn-primary" type="submit">' +
              (isTelugu ? 'లాగిన్' : 'Login') +
            '</button>' +
          '</div>' +
          '<p id="login-status" role="status" aria-live="polite"></p>' +
        '</form>' +
        '<p>' +
          (isTelugu ? 'ఖాతా లేదా?' : 'New here?') +
          ' <a href="#/register">' + (isTelugu ? 'నమోదు చేసుకోండి' : 'Create an account') + '</a>' +
        '</p>' +
        '<p><a href="#/">' + (isTelugu ? 'హోమ్‌కు తిరిగి వెళ్లండి' : 'Back to home') + '</a></p>' +
      '</div>';

    var form = el.querySelector('#login-form');
    var status = el.querySelector('#login-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = el.querySelector('#login-email').value.trim();
      var password = el.querySelector('#login-password').value;

      status.textContent = isTelugu ? 'దయచేసి వేచి ఉండండి...' : 'Please wait...';

      window.MH_API.login(email, password)
        .then(function (result) {
          if (!result || !result.access_token) {
            throw new Error('The server did not return an access token.');
          }

        sessionStorage.setItem('mh_access_token', result.access_token);
return window.MH_API.getMyProfile(result.access_token);
})
.then(function (user) {
  sessionStorage.setItem('mh_user_role', user.role);
  window.MH.navigate('#/dashboard');
})
        .catch(function (error) {
          sessionStorage.removeItem('mh_access_token');
          status.textContent = error.message || 'Login failed. Please try again.';
        });
    });
  }

  function register(el) {
    var isTelugu = window.MH.lang === 'te';

    el.innerHTML =
      '<div class="card" style="max-width:460px;margin:40px auto;padding:28px;">' +
        '<h1>' + (isTelugu ? 'ఖాతా సృష్టించండి' : 'Create an account') + '</h1>' +
        '<form id="register-form">' +
          '<div class="field">' +
            '<label for="register-name">' + (isTelugu ? 'పూర్తి పేరు' : 'Full name') + '</label>' +
            '<input class="input" id="register-name" type="text" minlength="2" maxlength="150" required autocomplete="name">' +
          '</div>' +
          '<div class="field">' +
            '<label for="register-email">Email</label>' +
            '<input class="input" id="register-email" type="email" required autocomplete="email">' +
          '</div>' +
          '<div class="field">' +
            '<label for="register-password">' + (isTelugu ? 'పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)' : 'Password (at least 8 characters)') + '</label>' +
            '<input class="input" id="register-password" type="password" minlength="8" maxlength="128" required autocomplete="new-password">' +
          '</div>' +
          '<div class="form-actions">' +
            '<button class="btn btn-primary" type="submit">' +
              (isTelugu ? 'నమోదు' : 'Register') +
            '</button>' +
          '</div>' +
          '<p id="register-status" role="status" aria-live="polite"></p>' +
        '</form>' +
        '<p>' +
          (isTelugu ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?') +
          ' <a href="#/login">' + (isTelugu ? 'లాగిన్' : 'Login') + '</a>' +
        '</p>' +
        '<p><a href="#/">' + (isTelugu ? 'హోమ్‌కు తిరిగి వెళ్లండి' : 'Back to home') + '</a></p>' +
      '</div>';

    var form = el.querySelector('#register-form');
    var status = el.querySelector('#register-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fullName = el.querySelector('#register-name').value.trim();
      var email = el.querySelector('#register-email').value.trim();
      var password = el.querySelector('#register-password').value;

      status.textContent = isTelugu ? 'దయచేసి వేచి ఉండండి...' : 'Please wait...';

      window.MH_API.register(fullName, email, password)
        .then(function () {
          status.textContent = isTelugu
            ? 'ఖాతా విజయవంతంగా సృష్టించబడింది. ఇప్పుడు లాగిన్ చేయండి.'
            : 'Account created successfully. Please log in.';
          form.reset();

setTimeout(function () {
  window.MH.navigate('#/login');
}, 1500);;
        })
        .catch(function (error) {
          status.textContent = error.message || 'Registration failed. Please try again.';
        });
    });
  }

  window.MH_PAGES.login = login;
  window.MH_PAGES.register = register;
})();
