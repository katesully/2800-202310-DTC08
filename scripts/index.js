function saveLanguageAndShowSignup() {
  console.log("saveLanguageAndShowSignup called");
  // Show login and signup buttons
  const loginButton = document.getElementById("login-button");
  const signupButton = document.getElementById("signup-button");
  loginButton.style.display = "inline-block";
  signupButton.style.display = "inline-block";
}


// Get a reference to the HTML dropdown element where we will display the values
const dropdown = document.getElementById("language-dropdown");

// Get the collection reference for the desired collection
const collectionRef = db.collection("Languages");


function populateLanguageDropdown() {
  // Fetch the documents from the collection
  collectionRef.get().then((querySnapshot) => {
    // Loop through each document and get its string fields
    const values = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      for (const key in data) {
        if (typeof data[key] === "string") {
          values.push(data[key]);
        }
      }
    });

    values.sort();


    // Populate the dropdown with the values
    values.forEach((value) => {
      const option = document.createElement("option");
      option.text = value;
      dropdown.add(option);
    });
    option = document.createElement("option");
    option.text = "";
    option.selected = true;
    dropdown.add(option);
  });
}

// Call the populateDropdown function to start populating the dropdown
populateLanguageDropdown();

