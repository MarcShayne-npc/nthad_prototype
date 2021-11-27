import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_FIREBASE_APP_ID,

  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

/* For testing firebase
const app =firebase.initializeApp({
    apiKey: "AIzaSyCQYQHXopOe8xPdm87GgjJW8kHVN5Z8tfI",
  
    authDomain: "test-c0303.firebaseapp.com",
  
    projectId: "test-c0303",
  
    storageBucket: "test-c0303.appspot.com",
  
    messagingSenderId: "201633053334",
  
    appId: "1:201633053334:web:187187add226ced6f560b7",
  
    measurementId: "G-18GQ2NQG6P"

})
*/
export const db = getFirestore();
export const auth = app.auth();
export default app;
