// forgive the suckiness, but whatever
(function (exports) {
'use strict';

var key;
var Authenticator = exports.Authenticator;
var $ = function (x) {
  return document.querySelector(x);
};

function generate(ke) {
  Authenticator.generateKey().then(function (k) {
    key = ke || k;

    var companyName = $('.js-company-name').value;
    var userAccount = $('.js-user-account').value;

    // obviously don't use this in production, but it's not so bad for the demo
    var src = 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl='
      + encodeURIComponent(
          'otpauth://totp/'
        + encodeURIComponent(companyName)
        + ':'
        + encodeURIComponent(userAccount)
        + '?secret='
        + key.replace(/\s+/g, '').toUpperCase()
      );

    $('.js-key').innerHTML = key; // safe to inject because I created it
    $('img.js-qrcode').src = src;

    Authenticator.generateToken(key).then(function (token) {
      console.log('token', token);

      Authenticator.verifyToken(key, token).then(function (result) {
        console.log('verify', result);

        Authenticator.verifyToken(key, '000 000').then(function (result) {
          console.log('reject', result);
        });
      });
    });
  });
}

$('.js-verify').addEventListener('click', function () {
  var token = $('.js-token').value;

  Authenticator.verifyToken(key, token).then(function (result) {
    var msg;
    if (result) {
      msg = 'Correct!';
    } else {
      msg = 'FAIL!';
    }

    window.alert(msg);
  });
});

$('.js-generate').addEventListener('click', function () {
  generate(null);
});

$('.js-company-name').value = 'ACME Co';
$('.js-user-account').value = 'john@example.com';
generate('hxdm vjec jjws rb3h wizr 4ifu gftm xboz');

}(
  'undefined' !== typeof window ? window : module.exports
));
