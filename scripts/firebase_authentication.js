const dotenv = require('dotenv')

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    projectId: process.env.FIREBASE_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKEY,
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

