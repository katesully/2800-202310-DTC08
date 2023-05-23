

console.log("index.js loaded");


function saveLanguageAndShowSignup() {
  console.log("saveLanguageAndShowSignup called");
  // Show login and signup buttons and info div
  const loginButton = document.getElementById("login-button");
  const signupButton = document.getElementById("signup-button");
  const backgroundImage = document.getElementById("backgroundCard");
  const backgroundImageB = document.getElementById("backgroundCardB");
  const backgroundImageC = document.getElementById("backgroundCardC");
  loginButton.style.display = "inline-block";
  signupButton.style.display = "inline-block";
  backgroundImage.style.display = "block";
  backgroundImageB.style.display = "block";
  backgroundImageC.style.display = "block";
}

