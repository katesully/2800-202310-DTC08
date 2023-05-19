

console.log("index.js loaded");


function saveLanguageAndShowSignup() {
  console.log("saveLanguageAndShowSignup called");
  // Show login and signup buttons and info div
  const loginButton = document.getElementById("login-button");
  const signupButton = document.getElementById("signup-button");
  const backgroundImage = document.getElementById("backgroundCard");
  loginButton.style.display = "inline-block";
  signupButton.style.display = "inline-block";
  backgroundImage.style.display = "block";
}

