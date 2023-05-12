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
    var language = navigator.language || navigator.userLanguage;
    console.log(language);

    // Asynch call to save the form fields into Firestore
    db.collection("users").doc(user.uid).update({
      name: userName,
      city: userCity,
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

// Function to handle password change
function handleChangePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  // Reauthenticate the user
  user.reauthenticateWithCredential(credential)
    .then(() => {
      // User successfully reauthenticated, update the password
      user.updatePassword(newPassword)
        .then(() => {
          // Password updated successfully
          console.log('Password updated.');
        })
        .catch((error) => {
          // An error occurred while updating the password
          console.error('Error updating password:', error);
        });
    })
    .catch((error) => {
      // An error occurred while reauthenticating the user
      console.error('Error reauthenticating user:', error);
    });
}

// Example usage: Call the handleChangePassword function when the form is submitted
// const changePasswordForm = document.getElementById('password-div');
changePassword = function () {
  const currentPassword = document.getElementById('current-password-input').innerText;
  const newPassword = document.getElementById('new-password-input').innerText;
  handleChangePassword(currentPassword, newPassword);
};

