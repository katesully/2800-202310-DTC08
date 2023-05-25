console.log("index.js loaded");

function saveLanguageAndShowSignup() {
  console.log("saveLanguageAndShowSignup called");
  // Show login and signup buttons and info div
  const loginButton = document.getElementById("login-button");
  const signupButton = document.getElementById("signup-button");
  loginButton.style.display = "inline-block";
  signupButton.style.display = "inline-block";
}
