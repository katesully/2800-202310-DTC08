import { app } from './firebase_authentication.js'
import { 
  getAuth,
  AuthErrorCodes,
  onAuthStateChanged, 
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
const auth = getAuth(app);

const btnLogin = document.querySelector('#btnLogin');
const btnSignUp = document.querySelector('#btnSignUp');
const btnLogout = document.querySelector('#btnLogout');
const divLoginError = document.querySelector('#divLoginError')
const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')
const passwordInput = document.querySelector('#passwordInput');
const usernameInput = document.querySelector('#usernameInput');
const emailInput = document.querySelector('#emailInput');


export const hideLogoutBtn = () => {
  btnLogout.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLogoutBtn = () => {
  divLoginError.style.display = 'block'
}

export const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
  divLoginError.style.display = 'block'    
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
  }
  else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`      
  }
}


const loginEmailPassword = async () => {
  console.log("Clicked login button")
  const loginEmail = emailInput.value;
  const loginPassword = passwordInput.value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
    console.log("User logged in")
    monitorAuthState();
  } catch (error) {
    console.log(error);
    showLoginError(error);
  }

}

const createAccount = async () => {
  const newEmail = emailInput.value
  const newPassword = passwordInput.value

  try {
    await createUserWithEmailAndPassword(auth, newEmail, newPassword)
      .then((userCredential) => {
        // Signed in
        console.log("User created")
        console.log("Successfully logged in")
        console.log(auth.currentUser)
        const user = userCredential.user;
      // set username
      updateProfile(auth.currentUser, {
        displayName: usernameInput.value,
        }).then(() => {
          // Update successful.
          console.log("Username set")
        }).catch((error) => {
          // An error happened.
          console.log("Error setting username")
          console.log(error)
        });
      })
      .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      });
      monitorAuthState();
  }

  catch(error) {
    console.log(`There was an error: ${error}`)
    console.log(error.code)
    console.log(error.message)
    showLoginError(error)
  } 
}

export const showLoginState = (user) => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}
export const clearLoginState = (user) => {
  // clear contents of lblAuthState
  lblAuthState.innerHTML = ''

}

// Monitor auth state
export const user = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user);
      return true;
    }
    else {
      console.log("User is not logged in");
      return false;
    }
  })
}


export const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user);
      showLogoutBtn();
      showLoginState(user);
      return true;
    }
    else {
      console.log("User is not logged in");
      clearLoginState(user);
      hideLogoutBtn();
      return false;
    }
  })
}

// Log out
const logout = async () => {
  await signOut(auth);
}

btnLogin.addEventListener('click', loginEmailPassword);
btnSignUp.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

monitorAuthState();
hideLoginError()