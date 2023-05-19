// this code was written by Oceaan with help from
//https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page

// var check = function () {
//     if (document.getElementById('passwordInput').value ==
//         document.getElementById('confirmPassword').value) {
//         document.getElementById('message').style.color = 'green';
//         document.getElementById('message').innerHTML = 'Your passwords match!';
//     } else {
//         document.getElementById('message').style.color = 'red';
//         document.getElementById('message').innerHTML = 'Your passwords do not match.';
//     }
// }

const newPassword = document.querySelector('#password');
const confirmPassword = document.querySelector('#passwordRepeat');

// Listen for changes to the password fields
newPassword.addEventListener('input', validatePasswords);
confirmPassword.addEventListener('input', validatePasswords);

function validatePasswords() {
    console.log("signup.js: validatePasswords() called");
  if (newPassword.value !== confirmPassword.value) {
    // Set a custom error message and mark the confirm password field as invalid
    
    confirmPassword.setCustomValidity('Passwords do not match');

    // You can also add a class to the field to apply custom styles
    confirmPassword.classList.add('is-invalid');
  } else {
    // Reset the error message and mark the field as valid
    confirmPassword.setCustomValidity('');
    confirmPassword.classList.remove('is-invalid');
  }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    "use strict";
    window.addEventListener(
        "load",
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName("needs-validation");
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    "submit",
                    function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false
                );
            });
        },
        false
    );
})();

//console log when document ready to make sure it's working
$(document).ready(function () {
    console.log("signup.js: Document ready");
});