var currentUser;

function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Go to the correct user document by referencing the user UID
      currentUser = db.collection("users").doc(user.uid);
      // Get the document for the current user.
      currentUser.get().then(userDoc => {
        // Get the data fields of the user
        var userName = userDoc.data().name;
        // var userUserName = userDoc.data().username;
        var userCity = userDoc.data().city;
        var userPassword = userDoc.data().password;
        var userLanguage = userDoc.data().language;

        // If the data fields are not empty, then write them into the form.
        if (userName) {
          document.getElementById("nameInput").value = userName;
        }
        // if (userUserName) {
        //   document.getElementById("userNameInput").value = userUserName;
        // }
        if (userCity) {
          document.getElementById("cityInput").value = userCity;
        }
        if (userPassword) {
          document.getElementById("passwordInput").value = userPassword;
        }
        if (userLanguage) {
          document.getElementById("languageInput").value = userLanguage;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

// Call the function to run it
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
  firebase.auth().onAuthStateChanged(function (user) {
    // Get values from the form
    var userName = document.getElementById('nameInput').value;
    var userCity = document.getElementById('cityInput').value;
    var userPassword = document.getElementById('passwordInput').value;
    var language = navigator.language || navigator.userLanguage;
    console.log(language);

    // Asynch call to save the form fields into Firestore
    db.collection("users").doc(user.uid).update({
      name: userName,
      city: userCity,
      password: userPassword,
      language: language
    })
      .then(function () {
        console.log('Saved user profile info');
        document.getElementById('personalInfoFields').disabled = true;
        // redirect to profile page
        window.location.assign("/settings");
      });
  });
}

