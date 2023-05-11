// this code was written by Oceaan with help from
//https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { app } from './firebase_authentication.js'
// var firebase = require('firebase');
// var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, 
      requireDisplayName: false
    }
  ]
});

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });


var check = function () {
    if (document.getElementById('passwordInput').value ==
        document.getElementById('confirmPassword').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'Your passwords match!';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Your passwords do not match.';
    }
}

//console log when document ready to make sure it's working
$(document).ready(function () {
    console.log("signup.js: Document ready");
});