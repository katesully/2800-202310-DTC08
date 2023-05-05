// this code was written by Oceaan with help from
//https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page

var check = function () {
    if (document.getElementById('passwordInput').value ==
        document.getElementById('confirmPassword').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'matching';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'not matching';
    }
}

//console log when document ready to make sure it's working
$(document).ready(function () {
    console.log("signup.js: Document ready");
});