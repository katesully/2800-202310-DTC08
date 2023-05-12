const app = require('./firebase_authentication.js');
const auth = require('./firebase_authentication.js')
const app = require('https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js');

const checkAuth = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        return true
      } else {
        return false
      }
    }, function(error) {
      console.log(error);
    });
  };

module.exports = checkAuth;